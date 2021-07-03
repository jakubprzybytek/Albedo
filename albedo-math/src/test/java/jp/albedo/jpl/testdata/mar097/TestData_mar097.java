package jp.albedo.jpl.testdata.mar097;

import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.util.stream.Stream;

public class TestData_mar097 {

    public final static SpkKernelRepository SPK_KERNEL = new SpkKernelLoader()
            .load(Stream.of(
                    TestDataSpk_mar097.SUN_FOR_2019_10_09,
                    TestDataSpk_mar097.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_mar097.EARTH_FOR_2019_10_09,
                    TestDataSpk_mar097.MARS_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_mar097.MARS_FOR_2019_10_09,
                    TestDataSpk_mar097.PHOBOS_FOR_2019_10_09,
                    TestDataSpk_mar097.DEIMOS_FOR_2019_10_09)
            )
            .kernel();

}
