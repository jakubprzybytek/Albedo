package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.Correction;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.utils.Collectors;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class StateSolverFactory {

    private final SpkKernelRepository spkKernel;

    private JplBody targetBody;

    private JplBody observerBody;

    private final Set<Correction> corrections = new HashSet<>();

    public StateSolverFactory(SpkKernelRepository spkKernel) {
        this.spkKernel = spkKernel;
    }

    public StateSolverFactory target(JplBody targetBody) {
        this.targetBody = targetBody;
        return this;
    }

    public StateSolverFactory observer(JplBody observerBody) {
        this.observerBody = observerBody;
        return this;
    }

    public StateSolverFactory corrections(Correction... corrections) {
        this.corrections.addAll(Arrays.asList(corrections));
        return this;
    }

    public StateSolver build() throws JplException {
        if (targetBody == null || observerBody == null) {
            throw new IllegalStateException("Cannot build StateSolver without information about target and observer bodies!");
        }

        if (corrections.isEmpty()) {
            return buildUncorrected();
        } else {
            return buildCorrected();
        }
    }

    private StateSolver buildUncorrected() throws JplException {
        List<SpkKernelCollection> spkRecordsForTarget = spkKernel.getAllTransientSpkKernelCollections(targetBody);

        // check if observer is on the spkRecords for target
        List<SpkKernelCollection> directSpkRecordsToTarget = spkRecordsForTarget.stream()
                .collect(Collectors.sublistWithStartingCondition(
                        record -> record.getCenterBody() == observerBody
                ));

        if (!directSpkRecordsToTarget.isEmpty()) {
            return new DirectStateSolver(directSpkRecordsToTarget, false);
        }

        List<SpkKernelCollection> spkRecordsForObserver = spkKernel.getAllTransientSpkKernelCollections(observerBody);

        // check if target is on the spkRecords for observer
        List<SpkKernelCollection> directSpkRecordsToObserver = spkRecordsForObserver.stream()
                .collect(Collectors.sublistWithStartingCondition(
                        record -> record.getCenterBody() == targetBody
                ));

        if (!directSpkRecordsToObserver.isEmpty()) {
            return new DirectStateSolver(directSpkRecordsToObserver, true);
        }

        // try to find common center body and drop duplicated records
        List<SpkKernelCollection> relativeSpkRecordsForTarget = spkRecordsForTarget.stream()
                .filter(record -> !spkRecordsForObserver.contains(record))
                .collect(java.util.stream.Collectors.toList());
        List<SpkKernelCollection> relativeSpkRecordsForObserver = spkRecordsForObserver.stream()
                .filter(record -> !spkRecordsForTarget.contains(record))
                .collect(java.util.stream.Collectors.toList());

        if (!relativeSpkRecordsForTarget.isEmpty() && !relativeSpkRecordsForObserver.isEmpty()
                && relativeSpkRecordsForTarget.get(0).getCenterBody().equals(relativeSpkRecordsForObserver.get(0).getCenterBody())) {
            return new CommonCenterBodyStateSolver(relativeSpkRecordsForTarget, relativeSpkRecordsForObserver);
        }

        throw new JplException("Cannot find SPK records for " + targetBody + " w.r.t. " + observerBody + "!");
    }

    private StateSolver buildCorrected() throws JplException {
        List<SpkKernelCollection> spkRecordsForTarget = spkKernel.getAllTransientSpkKernelCollections(targetBody);
        List<SpkKernelCollection> spkRecordsForObserver = spkKernel.getAllTransientSpkKernelCollections(observerBody);

        if (spkRecordsForTarget.get(0).getCenterBody() != spkRecordsForObserver.get(0).getCenterBody()) {
            throw new JplException("Cannot set up state solver for bodies that don't the same ancestor SPK record.");
        }

        if (corrections.containsAll(Arrays.asList(Correction.LightTime, Correction.StarAberration))) {
            final StateSolver lightTimeCorrectingStateSolverForTarget = new LightTimeCorrectingStateSolver(spkRecordsForTarget, spkRecordsForObserver);
            return new StarAberrationCorrectingStateSolver(lightTimeCorrectingStateSolverForTarget, spkRecordsForObserver);

        } else if (corrections.contains(Correction.LightTime)) {

            return new LightTimeCorrectingStateSolver(spkRecordsForTarget, spkRecordsForObserver);
        }

        throw new JplException("Cannot set up state solver for corrections: " + corrections);
    }
}
