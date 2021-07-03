package jp.albedo.jpl.testdata.de440;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;
import java.util.Collections;
import java.util.List;

public class TestDataSpk_de440 {

    public static SpkKernelCollection SUN_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-455990.8605211873, -10164.153171569056, -0.34116709362255426, 0.15909081160831753, 0.0018506343197832423, 9.679889959136377E-6, 7.012612128750007E-7, -3.7966953317498574E-8, 3.335068702399374E-9, -1.8160396887491537E-9, -2.7202449287697574E-11};
        coefficients.y = new double[]{1039278.4727334933, -1189.3570906234131, -26.38909493308264, -0.04435199077935622, 0.003008263165105876, 3.102895412976753E-5, 4.8428445122639085E-6, 3.975925972409614E-8, 2.4986761708122076E-8, 3.0722056866175407E-10, 2.866098709344748E-11};
        coefficients.z = new double[]{450996.32930615003, -215.0135880794347, -11.226174968401923, -0.03109580797745313, 0.0012350020163736574, 1.0431197409908896E-5, 2.589970133605912E-6, 2.6550244922659776E-8, 1.3018428655934041E-8, 3.57210963473656E-10, 1.941252776869667E-11};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        SUN_FOR_2019_10_09 = new SpkKernelCollection(JplBody.Sun, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MERCURY_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.234192E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{9770.12020536014, 1.3372847770287195E7, -6574.271810257993, -26753.83828040649, -225.9675684611343, -14.192498502827874, -0.0929706169064586, 0.0042727349017645955, 3.5267856279219456E-4, 3.0104744213968648E-5, 9.720052522187496E-7, 5.028417494729756E-8, 1.1368198358921025E-9, 1.4902155210862847E-10};
        coefficients.y = new double[]{-5.938232392119697E7, 1361903.4975221734, 725354.9116490874, 1412.858639862217, -290.4291845551805, -6.290126358002769, -0.6455404080352808, -0.011995164426368717, -6.800719818776468E-4, -7.81709214775193E-6, -9.704592006108568E-8, 1.6862051273519133E-8, 2.9254253112487E-10, 7.149747022768467E-11};
        coefficients.z = new double[]{-3.1874360491296835E7, -659006.1992306064, 388161.499669195, 3528.004727854257, -131.72219233525072, -1.8889580803456458, -0.3352057813149339, -0.006850623679890459, -3.9984825636191505E-4, -7.296155221573185E-6, -1.5317954709297716E-7, 3.7489065968233876E-9, 6.526294327412687E-10, -1.5308274352127492E-10};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        MERCURY_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection(JplBody.MercuryBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MERCURY_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(-1.42007472E10, 2.05140816E10);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{0.0, 0.0};
        coefficients.y = new double[]{0.0, 0.0};
        coefficients.z = new double[]{0.0, 0.0};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        MERCURY_FOR_2019_10_09 = new SpkKernelCollection(JplBody.Mercury, JplBody.MercuryBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection VENUS_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-7.861352150691658E7, 1.621496221533116E7, 985798.6291314324, -34661.90913917022, -989.9148424493401, 23.47617066352885, 0.3446500612786167, -0.008980823683474302, -1.132926179631438E-5, 2.749410689572513E-6};
        coefficients.y = new double[]{-6.715701789285201E7, -1.5786403070606835E7, 859841.5764972483, 32360.62132711788, -933.7183287170461, -18.58048204491512, 0.4469835788326351, 0.003428329167759509, -1.4595062380241326E-4, 1.0169098952321207E-6};
        coefficients.z = new double[]{-2.52886739049305E7, -8129417.517172128, 324512.0587469885, 16753.906109725907, -357.4917803264506, -9.84578481928477, 0.17931554737990704, 0.002110691485473324, -6.49529774679309E-5, 2.8601015215864316E-7};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        VENUS_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection(JplBody.VenusBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection VENUS_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(-1.42007472E10, 2.05140816E10);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{0.0, 0.0};
        coefficients.y = new double[]{0.0, 0.0};
        coefficients.z = new double[]{0.0, 0.0};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        VENUS_FOR_2019_10_09 = new SpkKernelCollection(JplBody.Venus, JplBody.VenusBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection EARTH_MOON_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{1.461585177138096E8, -3988891.8571416256, -695192.4726262927, 2340.1548614799563, 277.7945389667306, 0.20709129830977793, -0.04314783200716559, -7.227491643559057E-5, -9.053737918282743E-5, -2.5200650624457197E-6, 5.000533400889409E-6, -9.919610129547088E-7, -1.0066785898567277E-7};
        coefficients.y = new double[]{2.5268508330302447E7, 1.847528392810729E7, -115011.57818391036, -14704.98762270511, 19.94762608282473, 3.542029810827184, 0.013859407122631374, -5.473442534439549E-4, -3.602748643005761E-5, 1.155158530164237E-5, -8.563244113854206E-7, -4.779783202555102E-7, 1.751792375755572E-7};
        coefficients.z = new double[]{1.0953947967067383E7, 8009319.590902711, -49855.415869585195, -6374.598560745293, 8.645923688965114, 1.535140553758061, 0.006103310192777527, -2.1220785280595702E-4, -2.3787724499018925E-5, 4.565477464610753E-6, 9.544485165316793E-8, -2.813874348603929E-7, 6.393511127390325E-8};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        EARTH_MOON_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection EARTH_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.237648E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-4210.149613959241, -891.7736541656942, 194.47908837197608, 6.33713088065336, -0.6366711039549686, -0.007657620409118446, -2.6169692914824154E-4, 2.1714781359084187E-5, 3.2541795030830134E-6, -1.6349363968610135E-7, -8.607706828986981E-10, -1.3449694907251602E-10, 8.424554427815542E-12};
        coefficients.y = new double[]{1786.3071940697134, -1671.397574725194, -84.86711434788594, 12.954903847507092, 0.2408801441689786, -0.015586198982758682, -2.0950958148287496E-4, -5.027567109253517E-5, 2.340086165406504E-6, 9.21545749251558E-8, -5.219450603141884E-9, 3.1043328154712216E-11, -2.9927506809722147E-11};
        coefficients.z = new double[]{1122.781132691193, -604.1183198302373, -53.14083729583542, 4.718012295112765, 0.1599263958776781, -0.005626723755806182, -6.467047986108091E-5, -2.2714062485123666E-5, 6.537986856913363E-7, 5.321983474120282E-8, -2.045575055834581E-9, 2.4376292752608622E-11, -1.3073168771739651E-11};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        EARTH_FOR_2019_10_09 = new SpkKernelCollection(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MOON_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.237648E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{342287.5559124034, 72501.70480863188, -15811.260391840426, -515.2123414911152, 51.76172252174687, 0.6225688904858636, 0.021276109041572934, -0.0017654240632991199, -2.645666426953984E-4, 1.3292125807080769E-5, 6.998114562807034E-8, 1.0934678383653325E-8, -6.849210619943339E-10};
        coefficients.y = new double[]{-145227.789896016, 135885.57254919063, 6899.744619801906, -1053.241044057187, -19.583692594214128, 1.2671668337116029, 0.017033248022405804, 0.004087440627540211, -1.9025033493481333E-4, -7.492219305625705E-6, 4.243442998394715E-7, -2.5238402184645054E-9, 2.4331233090831377E-9};
        coefficients.z = new double[]{-91282.74407617026, 49115.16267521447, 4320.3802679175515, -383.577080468678, -13.00210685847134, 0.4574558385724395, 0.005257746759862771, 0.001846666186659147, -5.3154204649173706E-5, -4.326802805113968E-6, 1.663064143790723E-7, -1.9818064519206455E-9, 1.0628560495979664E-9};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        MOON_FOR_2019_10_09 = new SpkKernelCollection(JplBody.Moon, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

}
