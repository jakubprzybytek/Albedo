package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.kernel.tree.Forest;
import jp.albedo.jpl.kernel.tree.ForestEdgeVisitor;
import jp.albedo.jpl.state.impl.StateSolverFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class SpkKernelRepository {

    private static final Log LOG = LogFactory.getLog(SpkKernelRepository.class);

    private final Forest<JplBody, SpkKernelCollection> spkKernelRoot = new Forest<>();

    void registerSpkKernelRecord(SpkKernelCollection newRecord) {

        LOG.info(String.format("%s w.r.t %s in %s reference frame",
                newRecord.getBody(), newRecord.getCenterBody(),
                newRecord.getReferenceFrame()));

        Optional<SpkKernelCollection> existingRecord = spkKernelRoot.getEdge(newRecord.getCenterBody(), newRecord.getBody());
        if (existingRecord.isPresent()) {
            SpkKernelCollection spkKernelCollection = existingRecord.get();
            if (spkKernelCollection.getKernelFileName().equals(newRecord.getKernelFileName())) {
                existingRecord.get().merge(newRecord);
            } else {
                LOG.info(String.format("Records already registered for %s w.r.t %s in %s reference frame from file: %s, skipping.",
                        newRecord.getBody(), newRecord.getCenterBody(),
                        newRecord.getReferenceFrame(),
                        existingRecord.get().getKernelFileName()));
            }
        } else {
            spkKernelRoot.addEdge(newRecord.getCenterBody(), newRecord.getBody(), newRecord);
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
    public SpkKernelCollection getSpkKernelCollection(JplBody target, JplBody observer) throws JplException {
        return spkKernelRoot.getEdge(observer, target)
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
    public List<SpkKernelCollection> getAllTransientSpkKernelCollections(JplBody target) throws JplException {
        return spkKernelRoot.findEdgesTo(target)
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

    public <ReturnType> ForestEdgeVisitor<JplBody, SpkKernelCollection, ReturnType> edgeVisitor(Function<SpkKernelCollection, ReturnType> visitFunction) {
        return new ForestEdgeVisitor<>(spkKernelRoot, visitFunction);
    }

}
