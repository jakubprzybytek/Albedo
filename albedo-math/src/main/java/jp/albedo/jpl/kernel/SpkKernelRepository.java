package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.SpkFileLoader;
import jp.albedo.jpl.kernel.tree.Forest;
import jp.albedo.jpl.state.impl.StateSolverFactory;

import java.io.File;
import java.util.List;
import java.util.Optional;

public class SpkKernelRepository {

    private final Forest<JplBody, SpkKernelRecord> spkKernelForest = new Forest<>();

    /**
     * Loads SPK Kernel Records from provided binary SPK file.
     * Only records that overlap with requested time span will be loaded.
     *
     * @param file     File to load from. It needs to be binary SPK file.
     * @param startJde Start date of the time span.
     * @param endJde   End date of the time span.
     * @throws JplException If any error during file load occur.
     */
    public void load(File file, double startJde, double endJde) throws JplException {
        final SpkFileLoader loader = new SpkFileLoader(file);
        loader.loadAll(startJde, endJde)
                .forEach(this::storeNewSpkKernelRecord);
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
                .orElseThrow(() -> new JplException("Cannot find Chebyshev data for target: " + target + " w.r.t. " + observer));
    }

    /**
     * Returns list of SPK Kernel Records for given target. Those records are collected from its furthest center body
     * (for example Solar System Barycenter) to this body.
     *
     * @param target Target body.
     * @return List of SPK Kernel Records
     * @throws JplException if any SPK Kernel Records cannot be found for requested target.
     */
    public List<SpkKernelRecord> getSpkKernelRecords(JplBody target) throws JplException {
        return spkKernelForest.findEdgesTo(target)
                .orElseThrow(() -> new JplException("Cannot find Chebyshev data for target: " + target));
    }

    /**
     * Build State Solver builder/factory.
     *
     * @return State Solver builder/factory.
     */
    public StateSolverFactory stateSolver() {
        return new StateSolverFactory(this);
    }

    private void storeNewSpkKernelRecord(SpkKernelRecord newRecord) {
        Optional<SpkKernelRecord> existingRecord = spkKernelForest.getEdge(newRecord.getCenterBody(), newRecord.getBody());
        if (existingRecord.isPresent()) {
            existingRecord.get().merge(newRecord);
        } else {
            spkKernelForest.addEdge(newRecord.getCenterBody(), newRecord.getBody(), newRecord);
        }
    }

}
