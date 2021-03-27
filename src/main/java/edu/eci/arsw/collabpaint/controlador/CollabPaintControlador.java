package edu.eci.arsw.collabpaint.controlador;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ---------------------------------------------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------------------------
 * 													CLASE: CollabPaintControlador
 * ---------------------------------------------------------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------------------------------------------------------
 * @author Santiago Buitrago
 * @version 1.0
 * ---------------------------------------------------------------------------------------------------------------------------
 */

public class CollabPaintControlador {
    @Autowired
    SimpMessagingTemplate msgt;
    final ConcurrentHashMap<String, List<Point>> points = new ConcurrentHashMap<>();

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt, @DestinationVariable String numdibujo) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        if (!points.containsKey(numdibujo)) {
            points.put(numdibujo, new ArrayList<Point>());
            points.get(numdibujo).add(pt);
        } else {
            points.get(numdibujo).add(pt);
        }
        msgt.convertAndSend("/topic/newpoint." + numdibujo, pt);
        if (points.get(numdibujo).size() % 4 == 0) {
            msgt.convertAndSend("/topic/newpolygon." + numdibujo, points.get(numdibujo));
        }
    }
}
