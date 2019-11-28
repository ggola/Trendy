export const GET_TRENDS = 'GET_TRENDS';

// Models
import Trend from '../../models/trend';

import ENV from '../../ENV';

// Action: GET_TRENDS
export const getTrends = (location) => {

    return async dispatch => {

        // Get address from location coords
        try {
            const responseAddress = await fetch(`https://geocode.xyz/${location.coords.latitude},${location.coords.longitude}?geoit=json`);

            if (!responseAddress.ok) {
                throw new Error('Error fetching location address' + responseAddress.status)
            }

            if (responseAddress) {
                const resDataAddress = await responseAddress.json();

                // Format address
                const text = `${resDataAddress.staddress} ${resDataAddress.stnumber} ${resDataAddress.city} ${resDataAddress.country}`;
                const textEncoded = encodeURIComponent(text); 
            
                // Get woeid from formatted address
                try {
                    const responseWoeid = await fetch(`https://www.yahoo.com/news/_tdnews/api/resource/WeatherSearch;text=${textEncoded}`)

                    if (!responseWoeid.ok) {
                        throw new Error('Error fetching location woeid' + responseWoeid.status)
                    }

                    if (responseWoeid) {
                        const resDataWoeid = await responseWoeid.json();
                        const woeid = resDataWoeid[0].woeid;
                        
                        // Call twitter API with woeid to get trends
                        try {
                            const responseTwitter = await fetch(`https://api.twitter.com/1.1/trends/place.json?id=${woeid}`, {
                                method: 'GET',
                                withCredentials: true,
                                credentials: 'include',
                                headers: {
                                    'Authorization': 'Bearer ' + ENV.bearerToken
                                },
                            });

                            if (!responseTwitter.ok) {
                                throw new Error('Error fetching twitter trends' + responseTwitter.status)
                            }

                            if (responseTwitter) {
                                const resDataTwitter = await responseTwitter.json();

                                // Build trends array
                                const tweetTrends = [];
                                for (var i = 0; i < resDataTwitter[0].trends.length; i++) {
                                    tweetTrends.push(new Trend(
                                        name = resDataTwitter[0].trends[i].name,
                                        volume = resDataTwitter[0].trends[i].tweet_volume
                                    ))
                                }

                                // Dispatch action
                                dispatch({
                                    type: GET_TRENDS,
                                    tweetTrends: tweetTrends
                                });
                            }
                        } catch (errTwitter) {
                            throw new Error('Incorrect request url for Twitter trends');
                        }
                    }
                } catch (errWoeid) {
                    throw new Error('Incorrect request url for woeid');
                }
            }
        } catch (errLocation) {
            throw new Error('Incorrect request url for address');
        }
    }
}