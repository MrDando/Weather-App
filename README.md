# Weather App

A simple weather app made for The Odin Project Fullstack Javascript path.

[Live APP](https://mrdando.github.io/Weather-App/)

## APIs

The webpage uses 3 different APIs.

### Open Weather API [(link)](https://openweathermap.org/api)
#### One Call API

Webpage uses Open Weather One Call API to get current weather and and daily forecast for the next 7 days. API is called using geographical coordinates (latitude, longitude) which are obtained from Open Cage API.

### Open Cage API   [(link)](https://opencagedata.com/api)
#### Forward Geocoding

Forward geocoding is used to obtain geographical coordinates based on location query. API returns array of locations with associated info, which includes location name, state, county, type and coordinates. This data is used to present list of locations to the user. Based on user selection geographical coordinates of selected location are sennt to Open Weather API.

### ipapi [(link)](https://ipapi.co/)

This API is used on webpage load to determine geographical location of the user based on the client IP. This API is used to avoid having empty webpage or hardcoded location selected at webpage load.

## Other Assets
### Weather Icons

Weather Icons used are made by [Those Icons](https://www.flaticon.com/authors/those-icons) from [www.flaticon.com](https://www.flaticon.com/)

### Background Image
[Background image](https://www.freepik.com/free-vector/mountain-ridges-vector-illustration-sunrise_11950790.htm#page=1&query=mountain&position=38) made by [aladzionak_volha](https://www.freepik.com/valadzionak-volha)