package jp.albedo.jpl.state;

import jp.albedo.jpl.JplBody;
import jp.albedo.jpl.files.binary.ReferenceFrame;
import jp.albedo.jpl.kernel.ChebyshevRecord;
import jp.albedo.jpl.kernel.SpkRecord;
import jp.albedo.jpl.kernel.TimeSpan;
import jp.albedo.jpl.kernel.XYZCoefficients;

import java.util.Collections;
import java.util.List;

public class TestData {

    public static SpkRecord MOON_EARTH_BARYCENTER_FOR_2019_10_09;

    static {
        TimeSpan timeSpan = new TimeSpan(6.22728E8, 6.241104E8);
        XYZCoefficients coefficients = new XYZCoefficients();
        coefficients.x = new double[]{1.4615862406374624E8, -3988891.8754618717, -695192.4725470829, 2340.1548738630845, 277.7945389756031, 0.20709129620712025, -0.04314783394638121, -7.227429386550286E-5, -9.053126603034796E-5, -2.521127622171856E-6, 5.007384666075405E-6, -9.914541663656054E-7, -1.0813794308081223E-7};
        coefficients.y = new double[]{2.5268555083780516E7, 1.847528392329651E7, -115011.57873583707, -14704.987620491851, 19.9476262953735, 3.5420298113216853, 0.013859408250347018, -5.473440658726733E-4, -3.6028022048981674E-5, 1.155144051967616E-5, -8.568939649327198E-7, -4.780586425278946E-7, 1.751115318976881E-7};
        coefficients.z = new double[]{1.0953952944021957E7, 8009319.6051462935, -49855.41597184457, -6374.59856315225, 8.645923720436818, 1.5351405548197503, 0.006103310320018878, -2.1220785588716188E-4, -2.378787005248201E-5, 4.565427491061808E-6, 9.528283646581848E-8, -2.8141222995618126E-7, 6.40398951745763E-8};

        List<ChebyshevRecord> chebyshevRecords = Collections.singletonList(new ChebyshevRecord(timeSpan, coefficients));

        MOON_EARTH_BARYCENTER_FOR_2019_10_09 = new SpkRecord(JplBody.EarthMoonBarycenter, JplBody.SolarSystemBarycenter, ReferenceFrame.J2000, chebyshevRecords);
    }

}
