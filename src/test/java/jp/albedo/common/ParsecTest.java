package jp.albedo.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ParsecTest {

    @Test
    void fromAU() {
        assertEquals(0.0000048481367817234, Parsec.fromAU(1.0));
        assertEquals(1.0, Parsec.fromAU(206264.8074967314));
    }

}