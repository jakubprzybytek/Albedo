package jp.albedo.jpl.testdata.de438;

import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.util.stream.Stream;

public class TestData_de438 {

    public final static SpkKernelRepository SPK_KERNEL = new SpkKernelLoader()
            .load(Stream.of(
                    TestDataSpk_de438.SUN_FOR_2019_10_09,
                    TestDataSpk_de438.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de438.EARTH_FOR_2019_10_09,
                    TestDataSpk_de438.MOON_FOR_2019_10_09,
                    TestDataSpk_de438.VENUS_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de438.VENUS_FOR_2019_10_09,
                    TestDataSpk_de438.JUPITER_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk_de438.JUPITER_FOR_2019_10_09))
            .kernel();

}
