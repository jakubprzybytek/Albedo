import React, { useState, useEffect } from 'react';
import hash from 'object-hash';
import 'd3-celestial';

export function D3Celestial(props) {

    var { config } = props;

    var PROXIMITY_LIMIT = 50;

    function distance(p1, p2) {
        var d1 = p2[0] - p1[0],
            d2 = p2[1] - p1[1];
        return Math.sqrt(d1 * d1 + d2 * d2);
    }

    var featuresCollections = [];
    
    const [featuresCollectionsHash, setFeaturesCollectionsHash] = useState("");

    useEffect(() => {

        const currentFeaturesCollectionsHash = hash(featuresCollections, 'md5');
        if (currentFeaturesCollectionsHash == featuresCollectionsHash) {
            return;
        }
        setFeaturesCollectionsHash(currentFeaturesCollectionsHash);

        if (featuresCollections.length > 0 && featuresCollections[0].features.length > 0) {

            var textStyle = {
                fill:"#f00",
                font: "bold 15px Helvetica, Arial, sans-serif",
                align: "center",
                baseline: "middle"
              };
              var pointStyle = { 
                stroke: "#f6c", 
                width: 2,
                fill: "rgba(255, 204, 255, 0.4)"
              };

              
            Celestial.add({
                type: "line",

                callback: function(error, json) {

                    if (error) return console.warn(error);
                    // Load the geoJSON file and transform to correct coordinate system, if necessary
                    var dsn = Celestial.getData(featuresCollections[0], config.transform);

                    Celestial.container.selectAll(".body")
                        .data([])
                        .exit()
                        .remove();

                    // Add to celestial objects container in d3
                    Celestial.container.selectAll(".bodies")
                        .data(dsn.features)
                        .enter().append("path")
                        .attr("class", "body"); 
                    // Trigger redraw to display changes
                    Celestial.redraw();
                },

                redraw: function() {

                    var m = Celestial.metrics(), // Get the current map size in pixels
                    // empty quadtree, will be used for proximity check
                    quadtree = d3.geom.quadtree().extent([[-1, -1], [m.width + 1, m. height + 1]])([]);
                    // Select the added objects by class name as given previously
                    Celestial.container.selectAll(".body").each(function(d) {
                        // If point is visible (this doesn't work automatically for points)
                        if (Celestial.clip(d.geometry.coordinates)) {
                            // get point coordinates
                            var pt = Celestial.mapProjection(d.geometry.coordinates);
                            // object radius in pixel, could be varable depending on e.g. dimension or magnitude 
                            var r = Math.pow(20 - d.properties.mag, 0.7); // replace 20 with dimmest magnitude in the data
                        
                            // draw on canvas
                            //  Set object styles fill color, line color & width etc.
                            Celestial.setStyle(pointStyle);
                            // Start the drawing path
                            Celestial.context.beginPath();
                            // Thats a circle in html5 canvas
                            Celestial.context.arc(pt[0], pt[1], r, 0, 2 * Math.PI);
                            // Finish the drawing path
                            Celestial.context.closePath();
                            // Draw a line along the path with the prevoiusly set stroke color and line width      
                            Celestial.context.stroke();
                            // Fill the object path with the prevoiusly set fill color
                            Celestial.context.fill();     

                            // Find nearest neighbor
                            var nearest = quadtree.find(pt);

                            // If neigbor exists, check distance limit
                            if (!nearest || distance(nearest, pt) > PROXIMITY_LIMIT) {
                                // Nothing too close, add it and go on
                                //quadtree.add(pt)
                                // Set text styles
                                //Celestial.setTextStyle(textStyle);
                                // and draw text on canvas with offset
                                //Celestial.context.fillText(d.properties.name, pt[0] + r + 2, pt[1] + r + 2);
                            }
                        }      
                    });
                }
            });

            Celestial.display(config);
        }
    });

    return (
        <div id="celestial-map">
            {React.Children.map(props.children, c => React.cloneElement(c, {addFeaturesCollections: (f) => {featuresCollections.push(f)}}))}
        </div>
    );
}

export function D3CelestialFeaturesCollections(props) {
    
    const { addFeaturesCollections } = props;

    var features = [];

    useEffect(() => {
        addFeaturesCollections({
            "type": "FeatureCollection",
            "features": features
        });
    });

    return (<span>
        {React.Children.map(props.children, c => React.cloneElement(c, {addFeature: (f) => {features.push(f)}}))}
    </span>);
}

export function D3CelestialPoint(props) {
    
    const { ra, dec, time, addFeature } = props;

    addFeature({
        "type": "Feature",
        "id": "f",
        "properties": {
            "name": time,
            "mag": 10,
            "dim": 20
        }, 
        "geometry": {
            "type": "Point",
            "coordinates": [ ra > 180.0 ? ra - 360.0 : ra, dec ]
        }
    });

    return null;
}
