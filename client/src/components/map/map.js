import React from "react"
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"

const MapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAs63MJgGa0WwS7gcKg_tuzQCcugg1EhGA&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `800px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
        },
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    return (
        <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: 37.4784, lng: 126.9516 }}
        >
            <MarkerClusterer
                onClick={props.onMarkerClustererClick}
                averageCenter
                enableRetinaIcons
                gridSize={60}
            >
                {props.realEstates && props.realEstates.map(realEstate => {
                    console.log(realEstate)
                    return (
                        < Marker
                            key={realEstate._id}
                            position={{ lat: parseFloat(realEstate.cords[0]), lng: parseFloat(realEstate.cords[1]) }}
                        />
                    )
                })}
            </MarkerClusterer>
        </GoogleMap>
    )
})

export default MapComponent;
