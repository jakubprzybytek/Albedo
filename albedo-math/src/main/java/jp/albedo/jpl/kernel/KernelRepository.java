package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.SpkFileLoader;
import jp.albedo.jpl.state.impl.StateSolverBuilder;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class KernelRepository {

    private final List<SpkRecord> spkKernel = new ArrayList<>();

    public void load(File file, double startJde, double endJde) throws JplException {
        final SpkFileLoader loader = new SpkFileLoader(file);
        loader.loadAll(startJde, endJde)
                .forEach(this::storeNewChebyshevData);
    }

    public SpkRecord getChebyshevDataFor(JplBody target, JplBody observer) throws JplException {
        return spkKernel.stream()
                .filter(chebyshevData -> chebyshevData.getBody() == target && chebyshevData.getCenterBody() == observer)
                .findFirst()
                .orElseThrow(() -> new JplException("Cannot find Chebyshev data for target: " + target + " w.r.t. " + observer));
    }

    public StateSolverBuilder stateSolver() {
        return new StateSolverBuilder(this);
    }

    private void storeNewChebyshevData(SpkRecord newData) {
        Optional<SpkRecord> existingData = spkKernel.stream()
                .filter(data -> data.getBody() == newData.getBody()
                        && data.getCenterBody() == newData.getCenterBody()
                        && data.getReferenceFrame() == newData.getReferenceFrame())
                .findFirst();

        if (existingData.isPresent()) {
            existingData.get().merge(newData);
        } else {
            spkKernel.add(newData);
        }
    }

}
