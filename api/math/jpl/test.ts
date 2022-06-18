import { TimeSpan, XYZCoefficients, SpkKernelCollection, SpkKernelRepository } from './kernel';
import { StateSolver, DirectStateSolver } from './state';
import { JplBody } from './';

const sunTimeSpan = new TimeSpan(6.22728E8, 6.241104E8);
const sunCoefficients: XYZCoefficients = {
    x: [-455990.8605211873, -10164.153171569056, -0.34116709362255426, 0.15909081160831753, 0.0018506343197832423, 9.679889959136377E-6, 7.012612128750007E-7, -3.7966953317498574E-8, 3.335068702399374E-9, -1.8160396887491537E-9, -2.7202449287697574E-11],
    y: [1039278.4727334933, -1189.3570906234131, -26.38909493308264, -0.04435199077935622, 0.003008263165105876, 3.102895412976753E-5, 4.8428445122639085E-6, 3.975925972409614E-8, 2.4986761708122076E-8, 3.0722056866175407E-10, 2.866098709344748E-11],
    z: [450996.32930615003, -215.0135880794347, -11.226174968401923, -0.03109580797745313, 0.0012350020163736574, 1.0431197409908896E-5, 2.589970133605912E-6, 2.6550244922659776E-8, 1.3018428655934041E-8, 3.57210963473656E-10, 1.941252776869667E-11]
};

const SUN_FOR_2019_10_09: SpkKernelCollection = {
    kernelFileName: "Test",
    body: JplBody.Sun, 
    centerBody: JplBody.SolarSystemBarycenter, 
    positionData: [ { timeSpan: sunTimeSpan, positionCoefficients: sunCoefficients } ]
};


const mecuryBarycenterTimeSpan = new TimeSpan(6.234192E8, 6.241104E8);
const mecuryBarycenterCoefficients: XYZCoefficients = {
    x: [9770.12020536014, 1.3372847770287195E7, -6574.271810257993, -26753.83828040649, -225.9675684611343, -14.192498502827874, -0.0929706169064586, 0.0042727349017645955, 3.5267856279219456E-4, 3.0104744213968648E-5, 9.720052522187496E-7, 5.028417494729756E-8, 1.1368198358921025E-9, 1.4902155210862847E-10],
    y: [-5.938232392119697E7, 1361903.4975221734, 725354.9116490874, 1412.858639862217, -290.4291845551805, -6.290126358002769, -0.6455404080352808, -0.011995164426368717, -6.800719818776468E-4, -7.81709214775193E-6, -9.704592006108568E-8, 1.6862051273519133E-8, 2.9254253112487E-10, 7.149747022768467E-11],
    z: [-3.1874360491296835E7, -659006.1992306064, 388161.499669195, 3528.004727854257, -131.72219233525072, -1.8889580803456458, -0.3352057813149339, -0.006850623679890459, -3.9984825636191505E-4, -7.296155221573185E-6, -1.5317954709297716E-7, 3.7489065968233876E-9, 6.526294327412687E-10, -1.5308274352127492E-10]
};

const MERCURY_BARYCENTER_FOR_2019_10_09: SpkKernelCollection = {
    kernelFileName: "Test",
    body: JplBody.MercuryBarycenter, 
    centerBody: JplBody.SolarSystemBarycenter, 
    positionData: [ { timeSpan: mecuryBarycenterTimeSpan, positionCoefficients: mecuryBarycenterCoefficients } ]
};


const mercuryTimeSpan = new TimeSpan(-1.42007472E10, 2.05140816E10);
const mercuryCoefficients: XYZCoefficients = {
    x: [0.0, 0.0],
    y: [0.0, 0.0],
    z: [0.0, 0.0],
};

const MERCURY_FOR_2019_10_09: SpkKernelCollection = {
    kernelFileName: "Test",
    body: JplBody.Mercury, 
    centerBody: JplBody.MercuryBarycenter, 
    positionData: [ { timeSpan: mercuryTimeSpan, positionCoefficients: mercuryCoefficients } ]
};

const kernelRepository: SpkKernelRepository = new SpkKernelRepository([
    MERCURY_BARYCENTER_FOR_2019_10_09,
    MERCURY_FOR_2019_10_09
]);

export const stateSolver: StateSolver = new DirectStateSolver([
    MERCURY_BARYCENTER_FOR_2019_10_09,
    MERCURY_FOR_2019_10_09
], false);
