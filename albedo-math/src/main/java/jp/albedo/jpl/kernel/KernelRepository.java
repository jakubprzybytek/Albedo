package jp.albedo.jpl.kernel;

import jp.albedo.jpl.JplException;
import jp.albedo.jpl.files.SpkFileLoader;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class KernelRepository {

    private final List<SpkKernelObjectChebyshevData> spkKernel = new ArrayList<>();

    public void load(File file, double startJde, double endJde) throws JplException {
        final SpkFileLoader loader = new SpkFileLoader(file);
        loader.loadAll(startJde, endJde)
                .forEach(this::storeNewChebyshevData);
    }

    private void storeNewChebyshevData(SpkKernelObjectChebyshevData newData) {
        Optional<SpkKernelObjectChebyshevData> existingData = spkKernel.stream()
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
