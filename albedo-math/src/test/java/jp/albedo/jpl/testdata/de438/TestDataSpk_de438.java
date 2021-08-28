package jp.albedo.jpl.testdata.de438;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.PositionAndVelocityChebyshevRecord;
import jp.albedo.jpl.kernel.PositionChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelCollection;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;

import java.util.Collections;
import java.util.List;

public class TestDataSpk_de438 {

    public static SpkKernelCollection SUN_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-455884.48855585506, -10164.155499764362, -0.3411683170841032, 0.15909067868675872, 0.0018506334181158674, 9.679620602878185E-6, 7.012644179059113E-7, -3.796680698484716E-8, 3.3311014819291988E-9, -1.8172360909786425E-9, -3.1282010162857314E-11};
        coefficients.y = new double[]{1039325.1106051152, -1189.3575759130874, -26.38909400812884, -0.04435198047992747, 0.003008260209138108, 3.102895996511483E-5, 4.842798923819553E-6, 3.976182277184461E-8, 2.4994293616558657E-8, 3.092114025093347E-10, 4.3366928003439235E-11};
        coefficients.z = new double[]{451001.28497513244, -215.0019379509757, -11.226174278559911, -0.03109578949732903, 0.0012350005356794543, 1.0431233160300685E-5, 2.5899518757836785E-6, 2.6549954658194798E-8, 1.302207541828127E-8, 3.5734938024976557E-10, 2.2588224191907733E-11};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        SUN_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Sun, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection EARTH_MOON_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{1.4615862406374624E8, -3988891.8754618717, -695192.4725470829, 2340.1548738630845, 277.7945389756031, 0.20709129620712025, -0.04314783394638121, -7.227429386550286E-5, -9.053126603034796E-5, -2.521127622171856E-6, 5.007384666075405E-6, -9.914541663656054E-7, -1.0813794308081223E-7};
        coefficients.y = new double[]{2.5268555083780516E7, 1.847528392329651E7, -115011.57873583707, -14704.987620491851, 19.9476262953735, 3.5420298113216853, 0.013859408250347018, -5.473440658726733E-4, -3.6028022048981674E-5, 1.155144051967616E-5, -8.568939649327198E-7, -4.780586425278946E-7, 1.751115318976881E-7};
        coefficients.z = new double[]{1.0953952944021957E7, 8009319.6051462935, -49855.41597184457, -6374.59856315225, 8.645923720436818, 1.5351405548197503, 0.006103310320018878, -2.1220785588716188E-4, -2.378787005248201E-5, 4.565427491061808E-6, 9.528283646581848E-8, -2.8141222995618126E-7, 6.40398951745763E-8};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        EARTH_MOON_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection EARTH_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.237648E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-4210.149596314894, -891.7736618423411, 194.47908760798376, 6.337130930864279, -0.6366711020602492, -0.007657620356875898, -2.616969332849205E-4, 2.1714780636812322E-5, 3.2541797997776476E-6, -1.6349358617739186E-7, -8.605490410861746E-10, -1.344884824474668E-10, 8.142520509635476E-12};
        coefficients.y = new double[]{1786.3072082463932, -1671.3975693941777, -84.8671150335065, 12.954903815132813, 0.2408801452962555, -0.015586198939023991, -2.095095726147201E-4, -5.027567158980191E-5, 2.3400861225360627E-6, 9.215457098077675E-8, -5.2194721466457845E-9, 3.1028113549699404E-11, -2.9917764161219906E-11};
        coefficients.z = new double[]{1122.7811445836603, -604.1183133720834, -53.14083786532613, 4.718012250356397, 0.15992639739195338, -0.005626723709082821, -6.467047513375947E-5, -2.271406261921008E-5, 6.537986621252292E-7, 5.321983808943225E-8, -2.045573802419618E-9, 2.4379197722320234E-11, -1.3063165198224266E-11};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        EARTH_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MOON_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.237648E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{342287.55496909725, 72501.70553678898, -15811.26035241688, -515.2123463126311, 51.76172244198418, 0.6225688871319132, 0.02127610940841891, -0.0017654240071114243, -2.6456666719649905E-4, 1.3292121475866732E-5, 6.996312612316899E-8, 1.0933990057916391E-8, -6.6199154513853E-10};
        coefficients.y = new double[]{-145227.7912569928, 135885.57231077438, 6899.7446854445125, -1053.241042936561, -19.58369271396536, 1.2671668319743563, 0.017033247325862814, 0.004087440673833835, -1.9025033172243496E-4, -7.492218995696926E-6, 4.2434605194752486E-7, -2.5226032660516827E-9, 2.4323312297143653E-9};
        coefficients.z = new double[]{-91282.7451740271, 49115.16222064411, 4320.380320417298, -383.5770773804004, -13.002107000241056, 0.4574558354302617, 0.005257746383073818, 0.0018466662002104503, -5.315420280951311E-5, -4.326803083535969E-6, 1.6630631271437637E-7, -1.982042630453135E-9, 1.062042754910972E-9};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        MOON_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Moon, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection VENUS_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-7.861341507461475E7, 1.6214962227195863E7, 985798.6283880196, -34661.90916946326, -989.9148416530567, 23.47617068422309, 0.34465006108289575, -0.008980823575339846, -1.1329197349830357E-5, 2.749110523035549E-6};
        coefficients.y = new double[]{-6.71569713142717E7, -1.5786403056353694E7, 859841.5772621981, 32360.621295934372, -933.7183295375095, -18.58048202490514, 0.4469835788898876, 0.003428328980194743, -1.4594983577901347E-4, 1.0176343933612525E-6};
        coefficients.z = new double[]{-2.528866897302557E7, -8129417.506267378, 324512.05905360094, 16753.906111217228, -357.4917806725975, -9.845784818905384, 0.17931554766072877, 0.002110691361240645, -6.495324291902742E-5, 2.8586507221580395E-7};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        VENUS_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.VenusBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection VENUS_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(-1.42007472E10, 2.05140816E10);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{0.0, 0.0};
        coefficients.y = new double[]{0.0, 0.0};
        coefficients.z = new double[]{0.0, 0.0};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        VENUS_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Venus, JplBody.VenusBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MARS_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.213456E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-2.4389203983678585E8, -4725707.863236613, 1008755.2153124659, 4732.163153996068, -243.62882279471765, -1.2245770175118367, -0.04454216803792031, -1.7284534315709142E-4, 3.5968228517495496E-6, 1.5933150997024639E-9, 7.531061809956475E-8};
        coefficients.y = new double[]{3.874630790139368E7, -2.7353380536617234E7, -156144.4860850069, 18633.77364670876, 80.48318674834425, -0.46919059419678016, -0.006255528156292305, -8.51440805518615E-4, -7.902504663766167E-6, 2.9866666884030083E-7, -5.32722018211137E-8};
        coefficients.z = new double[]{2.4315966561205428E7, -1.2418660372821888E7, -98841.0922082362, 8419.147638954117, 43.4919764548341, -0.18210009250071155, -0.0016820041472421546, -3.842378952615709E-4, -3.792907083528404E-6, 1.1796403869956372E-7, -2.0005013065959306E-8};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        MARS_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.MarsBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection MARS_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.238512E8, 6.238728E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{3.790848175400122E-5, 1.5513497167787398E-4, -2.7934244033505684E-5, -5.716979885141319E-5, 4.380560908500653E-6, 4.576511350063638E-6, -3.3289725773641767E-7, -1.1284933319556733E-7};
        coefficients.y = new double[]{-1.2647619428198803E-5, 8.402362902042362E-5, 1.1483085771881849E-4, -2.4806100611456747E-5, -1.7315234174900736E-5, 2.3096194214415637E-6, 7.638139107475543E-7, -1.1405708028967929E-7};
        coefficients.z = new double[]{-2.6653075807322358E-5, -3.897019738945714E-5, 7.526690404903104E-5, 1.7879837957914282E-5, -1.144735187372097E-5, -1.2624404786928192E-6, 5.804644700918358E-7, 1.1887923194903306E-9};
        XYZCoefficients velocityCoefficients = new XYZCoefficients();
        velocityCoefficients.x = new double[]{5.294617168132972E-10, -7.471042218412456E-9, -2.7669775025238955E-8, 2.8749740902933533E-9, 4.091224336657262E-9, -3.6988584192935295E-10, -1.462861726609206E-10, 0.0};
        velocityCoefficients.y = new double[]{1.884724512151245E-9, 3.0552530037503586E-8, -1.1790482275775958E-8, -1.197741726576252E-8, 1.9906847305889002E-9, 8.486821230528381E-10, -1.4785177074588056E-10, 0.0};
        velocityCoefficients.z = new double[]{7.745773738016709E-10, 2.0042071745135037E-8, 8.765857967873182E-9, -7.834559384135715E-9, -1.167385342079197E-9, 6.44960522324262E-10, 1.5410270808207988E-12, 0.0};

        List<PositionAndVelocityChebyshevRecord> positionAndVelocityChebyshevRecords = Collections.singletonList(new PositionAndVelocityChebyshevRecord(timeSpan, coefficients, velocityCoefficients));
        MARS_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Mars, JplBody.MarsBarycenter, ReferenceFrame.J2000, Collections.emptyList(), positionAndVelocityChebyshevRecords);
    }

    public static SpkKernelCollection JUPITER_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.213456E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-2.9880390784092035E7, 1.7828154842568E7, 3841.708850213341, -384.49180477825803, -0.3505562860349162, 0.0019514946158452427, 5.4500225004671795E-6, -4.141512942632222E-8};
        coefficients.y = new double[]{-7.222017238742459E8, 319481.6571668026, 93976.2100187814, 43.495983945293986, -0.9559739495509587, -0.0015436139490097973, 3.8457451190751175E-7, 8.143980765994029E-8};
        coefficients.z = new double[]{-3.0883385751621664E8, -296963.4080659916, 40187.64528305724, 28.003213301211996, -0.40124108111204737, -7.091210106373594E-4, 7.889984977384743E-8, 3.641035557095296E-8};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        JUPITER_BARYCENTER_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.JupiterBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

    public static SpkKernelCollection JUPITER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.237864E8, 6.239808E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{-134.5967784041254, -80.09177811651905, 19.130027930514927, 15.685133778456912, 6.221130319095021, -3.8590787828236985, -1.2592210886841517, 0.440084442123009, 0.09030085689932221, -0.029145506191401438, -4.7904796899089774E-4, 0.0015332223976045611, -5.201566515076195E-4, -1.4184688426688297E-4, 2.2139734726422944E-5, 9.534645645814521E-5};
        coefficients.y = new double[]{93.81379348279377, -97.73348071575761, -26.289341976850515, -4.543021735671699, 7.710673907312373, 3.006227823267934, -1.2724940334725199, -0.34445605299850257, 0.10699724883149742, 0.013968205662920674, -0.005967212206118511, 8.682754927047398E-4, 3.86551596177398E-4, -1.578733877090066E-4, -1.1862348986468874E-4, -1.450402623959235E-5};
        coefficients.z = new double[]{42.48098738703517, -47.89752959706809, -12.202159311173482, -1.8907514678082953, 3.776647724903956, 1.3723191361858733, -0.6277506829627639, -0.15741199173715525, 0.052547867301783846, 0.006202855033568877, -0.0028573413651540314, 4.3954798103884585E-4, 1.7532421594168568E-4, -7.809864857399873E-5, -5.538239458946492E-5, -4.887679158738223E-6};

        List<PositionChebyshevRecord> positionChebyshevRecords = Collections.singletonList(new PositionChebyshevRecord(timeSpan, coefficients));
        JUPITER_FOR_2019_10_09 = new SpkKernelCollection("Test", JplBody.Jupiter, JplBody.JupiterBarycenter, ReferenceFrame.J2000, positionChebyshevRecords, Collections.emptyList());
    }

}
