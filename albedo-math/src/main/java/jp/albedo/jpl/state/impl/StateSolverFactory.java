package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.StateSolver;
import jp.albedo.utils.Collectors;

import java.util.List;

public class StateSolverFactory {

    private final SpkKernelRepository spkKernel;

    private JplBody targetBody;

    private JplBody observerBody;

    public StateSolverFactory(SpkKernelRepository spkKernel) {
        this.spkKernel = spkKernel;
    }

    public StateSolver build() throws JplException {
        if (targetBody == null || observerBody == null) {
            throw new IllegalStateException("Cannot build StateSolver without information about target and observer bodies!");
        }

        List<SpkKernelRecord> spkRecordsForTarget = spkKernel.getAllTransientSpkKernelRecords(targetBody);

        // check if observer is on the spkRecords for target
        List<SpkKernelRecord> directSpkRecordsToTarget = spkRecordsForTarget.stream()
                .collect(Collectors.sublistWithStartingCondition(
                        record -> record.getCenterBody() == observerBody
                ));

        if (!directSpkRecordsToTarget.isEmpty()) {
            return new DirectStateSolver(directSpkRecordsToTarget, false);
        }

        List<SpkKernelRecord> spkRecordsForObserver = spkKernel.getAllTransientSpkKernelRecords(observerBody);

        // check if target is on the spkRecords for observer
        List<SpkKernelRecord> directSpkRecordsToObserver = spkRecordsForObserver.stream()
                .collect(Collectors.sublistWithStartingCondition(
                        record -> record.getCenterBody() == targetBody
                ));

        if (!directSpkRecordsToObserver.isEmpty()) {
            return new DirectStateSolver(directSpkRecordsToObserver, true);
        }

        // try to find common center body and drop duplicated records
        List<SpkKernelRecord> relativeSpkRecordsForTarget = spkRecordsForTarget.stream()
                .filter(record -> !spkRecordsForObserver.contains(record))
                .collect(java.util.stream.Collectors.toList());
        List<SpkKernelRecord> relativeSpkRecordsForObserver = spkRecordsForObserver.stream()
                .filter(record -> !spkRecordsForTarget.contains(record))
                .collect(java.util.stream.Collectors.toList());

        if (!relativeSpkRecordsForTarget.isEmpty() && !relativeSpkRecordsForObserver.isEmpty()
                && relativeSpkRecordsForTarget.get(0).getCenterBody().equals(relativeSpkRecordsForObserver.get(0).getCenterBody())) {
            return new CommonCenterBodyStateSolver(relativeSpkRecordsForTarget, relativeSpkRecordsForObserver);
        }

        throw new JplException("Cannot find SPK records for " + targetBody + " w.r.t. " + observerBody + "!");
    }

    public StateSolverFactory target(JplBody targetBody) {
        this.targetBody = targetBody;
        return this;
    }

    public StateSolverFactory observer(JplBody observerBody) {
        this.observerBody = observerBody;
        return this;
    }

}
