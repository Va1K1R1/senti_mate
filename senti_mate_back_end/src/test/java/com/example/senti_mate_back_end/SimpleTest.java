package com.example.senti_mate_back_end;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SimpleTest {

    @Test
    public void testSimpleAddition() {
        System.out.println("[DEBUG_LOG] Running simple addition test");
        assertEquals(4, 2 + 2, "2 + 2 should equal 4");
    }
}