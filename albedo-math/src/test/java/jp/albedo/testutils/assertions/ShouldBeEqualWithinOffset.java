/*
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * Copyright 2012-2020 the original author or authors.
 */
package jp.albedo.testutils.assertions;

import jp.albedo.common.AstronomicalCoordinates;
import org.assertj.core.data.Offset;
import org.assertj.core.error.BasicErrorMessageFactory;
import org.assertj.core.error.ErrorMessageFactory;

/**
 * Creates an error message indicating that an assertion that verifies that two numbers are equal within a positive offset failed.
 *
 * @author Alex Ruiz
 * @author Joel Costigliola
 */
public class ShouldBeEqualWithinOffset extends BasicErrorMessageFactory {

    public static ErrorMessageFactory shouldBeEqual(AstronomicalCoordinates actual, AstronomicalCoordinates expected,
                                                    Offset<Double> raOffset, Offset<Double> deOffset,
                                                    double raDifference, double deDifference) {
        return new ShouldBeEqualWithinOffset(actual, expected, raOffset, deOffset, raDifference, deDifference);
    }

    private ShouldBeEqualWithinOffset(AstronomicalCoordinates actual, AstronomicalCoordinates expected,
                                      Offset<Double> raOffset, Offset<Double> deOffset,
                                      double raDifference, double deDifference) {
        super("%n" +
                        "Expecting:%n" +
                        "  <%s>%n" +
                        "to be close to:%n" +
                        "  <%s>%n" +
                        "by less than <%s> in right ascension and <%s> in declination%n" +
                        "but difference was <%s> and <%s> respectively.%n",
                actual, expected, raOffset.value, deOffset.value, raDifference, deDifference);
    }

}
