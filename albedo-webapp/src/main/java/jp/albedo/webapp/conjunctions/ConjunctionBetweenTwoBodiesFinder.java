package jp.albedo.webapp.conjunctions;

import jp.albedo.common.Radians;
import jp.albedo.ephemeris.SimpleEphemeris;
import jp.albedo.utils.StreamUtils;
import jp.albedo.webapp.conjunctions.impl.LocalMinimumsFindingCollector;
import org.apache.commons.math3.util.Pair;

import java.util.List;
import java.util.stream.Collectors;

public class ConjunctionBetweenTwoBodiesFinder {

    static public List<Conjunction2> findAll(List<SimpleEphemeris> firstBodyEphemerides, List<SimpleEphemeris> secondBodyEphemerides, double maxSeparation) {

        return StreamUtils
                .zip(
                        firstBodyEphemerides.stream(),
                        secondBodyEphemerides.stream(),
                        Pair::new)
                .collect(LocalMinimumsFindingCollector.of(
                        (ephemerisPair) -> Radians.separation(ephemerisPair.getFirst().coordinates, ephemerisPair.getSecond().coordinates),
                        (ephemerisPair, separation) -> new Conjunction2(
                                ephemerisPair.getFirst().jde,
                                separation,
                                ephemerisPair.getFirst(),
                                ephemerisPair.getSecond())
                ))
                .stream()
                .filter(conjunction -> conjunction.separation <= maxSeparation)
                .collect(Collectors.toList());
    }

}
