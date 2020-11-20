package jp.albedo.jpl.state.impl;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.kernel.SpkKernelRepository;
import jp.albedo.jpl.state.StateSolver;

import java.util.LinkedList;
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
            throw new IllegalStateException("Cannot build StateSolver without information about target body and observer body!");
        }

        List<SpkKernelRecord> spkRecordsForTarget = spkKernel.getSpkKernelRecords(targetBody);

        // check if observer is on the spkRecords for target
        List<SpkKernelRecord> directSpkRecords = spkRecordsForTarget.stream()
                .collect(
                        LinkedList<SpkKernelRecord>::new,
                        (collectedRecords, record) -> {
                            if (!collectedRecords.isEmpty() || record.getCenterBody() == observerBody) {
                                collectedRecords.add(record);
                            }
                        },
                        LinkedList::addAll
                );

        if (!directSpkRecords.isEmpty()) {
            return new DirectStateSolver(directSpkRecords);
        }

        return null;
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
