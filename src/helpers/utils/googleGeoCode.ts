import axios from "axios";
import * as config from "../../config";

class GoogleGEOCode {
  public static getGoogleGEOCode = async (suggestAddress: string) => {
    const locationData: any = {};
    const URL =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      encodeURI(suggestAddress) +
      "&key=" +
      config.googleMapAPI;
    try {
      const {
        data: { geoData }
      } = await axios.get(URL);
      if (geoData && geoData.results && geoData.results.length > 0) {
        geoData.results.map((item: any) => {
          item.address_components.map((value: any) => {
            if (
              value.types[0] == "administrative_area_level_1" ||
              value.types[0] == "country"
            ) {
              locationData[value.types[0]] = value.short_name;
            } else {
              locationData[value.types[0]] = value.long_name;
            }
          });
        });
        const city =
          locationData.locality != undefined
            ? locationData.locality
            : locationData.administrative_area_level_2;
        const buildingName =
          (locationData.subpremise != undefined
            ? locationData.subpremise
            : "") +
          " " +
          (locationData.premise != undefined ? locationData.premise : "");
        const address1 = locationData.street_number
          ? locationData.street_number + " " + locationData.route
          : locationData.route;
        return {
          address1,
          buildingName,
          country: locationData.country,
          city,
          state: locationData.administrative_area_level_1,
          zipcode: locationData.postal_code,
          lat: geoData.results[0].geometry.location.lat,
          lng: geoData.results[0].geometry.location.lng
        };
      }
    } catch (error) {
      return error;
    }
  };
}

export default GoogleGEOCode;