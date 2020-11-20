package jp.albedo.jpl.state;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.SpkKernelRecord;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;
import org.assertj.core.data.Offset;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.within;

public class TestData {

    /**
     * Offset that WebGeocalc seems to use.
     */
    public static final Offset<Double> WEB_GEOCALC_OFFSET = within(0.0000001);

    public static SpkKernelRecord MOON_EARTH_BARYCENTER_FOR_2019_10_09;

    public static SpkKernelRecord EARTH_FOR_2019_10_09;

    static {
        TimeSpan earthMoonBarycenterTimeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients earthMoonBarycenterCoefficients = new XYZCoefficients();
        earthMoonBarycenterCoefficients.x = new double[]{1.4615862406374624E8, -3988891.8754618717, -695192.4725470829, 2340.1548738630845, 277.7945389756031, 0.20709129620712025, -0.04314783394638121, -7.227429386550286E-5, -9.053126603034796E-5, -2.521127622171856E-6, 5.007384666075405E-6, -9.914541663656054E-7, -1.0813794308081223E-7};
        earthMoonBarycenterCoefficients.y = new double[]{2.5268555083780516E7, 1.847528392329651E7, -115011.57873583707, -14704.987620491851, 19.9476262953735, 3.5420298113216853, 0.013859408250347018, -5.473440658726733E-4, -3.6028022048981674E-5, 1.155144051967616E-5, -8.568939649327198E-7, -4.780586425278946E-7, 1.751115318976881E-7};
        earthMoonBarycenterCoefficients.z = new double[]{1.0953952944021957E7, 8009319.6051462935, -49855.41597184457, -6374.59856315225, 8.645923720436818, 1.5351405548197503, 0.006103310320018878, -2.1220785588716188E-4, -2.378787005248201E-5, 4.565427491061808E-6, 9.528283646581848E-8, -2.8141222995618126E-7, 6.40398951745763E-8};

        List<ChebyshevRecord> earthMoonBarycenterChebyshevRecords = Collections.singletonList(new ChebyshevRecord(earthMoonBarycenterTimeSpan, earthMoonBarycenterCoefficients));

        MOON_EARTH_BARYCENTER_FOR_2019_10_09 = new SpkKernelRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, earthMoonBarycenterChebyshevRecords);

        TimeSpan earthTimeSpan = new TimeSpan(6.237648E8, 6.241104E8);
        XYZCoefficients earthCoefficients = new XYZCoefficients();
        earthCoefficients.x = new double[]{-4210.149596314894, -891.7736618423411, 194.47908760798376, 6.337130930864279, -0.6366711020602492, -0.007657620356875898, -2.616969332849205E-4, 2.1714780636812322E-5, 3.2541797997776476E-6, -1.6349358617739186E-7, -8.605490410861746E-10, -1.344884824474668E-10, 8.142520509635476E-12};
        earthCoefficients.y = new double[]{1786.3072082463932, -1671.3975693941777, -84.8671150335065, 12.954903815132813, 0.2408801452962555, -0.015586198939023991, -2.095095726147201E-4, -5.027567158980191E-5, 2.3400861225360627E-6, 9.215457098077675E-8, -5.2194721466457845E-9, 3.1028113549699404E-11, -2.9917764161219906E-11};
        earthCoefficients.z = new double[]{1122.7811445836603, -604.1183133720834, -53.14083786532613, 4.718012250356397, 0.15992639739195338, -0.005626723709082821, -6.467047513375947E-5, -2.271406261921008E-5, 6.537986621252292E-7, 5.321983808943225E-8, -2.045573802419618E-9, 2.4379197722320234E-11, -1.3063165198224266E-11};

        List<ChebyshevRecord> earthChebyshevRecords = Collections.singletonList(new ChebyshevRecord(earthTimeSpan, earthCoefficients));

        EARTH_FOR_2019_10_09 = new SpkKernelRecord(JplBody.Earth, JplBody.EarthMoonBarycenter, ReferenceFrame.J2000, earthChebyshevRecords);
    }

}
