package jp.albedo.jpl.testdata.de440;

import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.util.stream.Stream;

public class TestData_de440 {

    public final static SpkKernelRepository SPK_KERNEL = new SpkKernelLoader()
            .load(Stream.of(
                    TestDataSpk_de440.SUN_FOR_2019_10_09,
                    TestDataSpk_de440.MERCURY_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de440.MERCURY_FOR_2019_10_09,
                    TestDataSpk_de440.VENUS_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de440.VENUS_FOR_2019_10_09,
                    TestDataSpk_de440.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de440.EARTH_FOR_2019_10_09,
                    TestDataSpk_de440.MOON_FOR_2019_10_09)
            )
            .kernel();

}
