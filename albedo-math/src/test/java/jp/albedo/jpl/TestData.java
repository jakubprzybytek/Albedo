package jp.albedo.jpl;

import jp.albedo.jpl.kernel.SpkKernelLoader;
import jp.albedo.jpl.kernel.SpkKernelRepository;

import java.util.stream.Stream;

public class TestData {

    public final static SpkKernelRepository KERNEL = new SpkKernelLoader()
            .load(Stream.of(
                    TestDataSpk.SUN_FOR_2019_10_09,
                    TestDataSpk.EARTH_MOON_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk.EARTH_FOR_2019_10_09,
                    TestDataSpk.MOON_FOR_2019_10_09,
                    TestDataSpk.VENUS_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk.VENUS_FOR_2019_10_09,
                    TestDataSpk.JUPITER_BARYCENTER_FOR_2019_10_09,
                    TestDataSpk.JUPITER_FOR_2019_10_09))
            .kernel();

}
