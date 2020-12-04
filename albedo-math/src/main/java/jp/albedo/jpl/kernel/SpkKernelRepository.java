package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.tree.Forest;
import jp.albedo.jpl.state.impl.StateSolverFactory;

import java.util.List;
import java.util.Optional;

public class SpkKernelRepository {

    private final Forest<JplBody, SpkKernelRecord> spkKernelForest = new Forest<>();

    void registerSpkKernelRecord(SpkKernelRecord newRecord) {
        Optional<SpkKernelRecord> existingRecord = spkKernelForest.getEdge(newRecord.getCenterBody(), newRecord.getBody());
        if (existingRecord.isPresent()) {
            existingRecord.get().merge(newRecord);
        } else {
            spkKernelForest.addEdge(newRecord.getCenterBody(), newRecord.getBody(), newRecord);
        }
    }

    /**
     * Returns SPK Kernel Record for given target with regard to given observer.
     *
     * @param target   Target body.
     * @param observer Observer body.
     * @return SPK Kernel Record
     * @throws JplException if SPK Kernel Record cannot be found for requested target and observer.
     */
    public SpkKernelRecord getSpkKernelRecord(JplBody target, JplBody observer) throws JplException {
        return spkKernelForest.getEdge(observer, target)
                .orElseThrow(() -> new JplException("Cannot find SPK Kenerl record data for target: " + target + " w.r.t. " + observer));
    }

    /**
     * Returns list of SPK Kernel Records for given target. Those records are collected from its furthest center body
     * (for example Solar System Barycenter) to this body.
     *
     * @param target Target body.
     * @return List of SPK Kernel Records
     * @throws JplException if any SPK Kernel Records cannot be found for requested target.
     */
    public List<SpkKernelRecord> getAllTransientSpkKernelRecords(JplBody target) throws JplException {
        return spkKernelForest.findEdgesTo(target)
                .orElseThrow(() -> new JplException("Cannot find SPK Kernel record data for target: " + target));
    }

    /**
     * Build State Solver builder/factory.
     *
     * @return State Solver builder/factory.
     */
    public StateSolverFactory stateSolver() {
        return new StateSolverFactory(this);
    }

}
