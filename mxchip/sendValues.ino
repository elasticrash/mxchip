#include "AZ3166WiFi.h"
#include "IoT_DevKit_HW.h"
#include "http_client.h"
#include "Sensor.h"
#include "SystemTickCounter.h"

char ssid[] = "SSID";    //  your network SSID (name)
char pass[] = "PASSWORD"; // your network password
int status = WL_IDLE_STATUS;
static char buffInfo[128];
static RGB_LED rgbLed;
int INTERVAL = 5000;
int send_interval_ms = 0;
static volatile uint64_t msReadEnvData = 0;
#define READ_ENV_INTERVAL 10000
static HTS221Sensor *ht_sensor;
static DevI2C *ext_i2c;

void setup()
{
    Screen.init();
    initSensors();
    Screen.print(0, "HOME \r\n Welcome");

    delay(1000);
    InitWiFi();
    delay(3000);
}

void InitWiFi()
{
    if (WiFi.begin(ssid, pass) == WL_CONNECTED)
    {
        IPAddress ip = WiFi.localIP();
        Screen.print(1, ip.get_address());
    }
    else
    {
        Screen.print(1, "No Wi-Fi");
    }
}

void initSensors()
{
    ext_i2c = new DevI2C(D14, D15);

    if (ext_i2c == NULL)
    {
        Screen.print(0, "Error \r\n ext_i2c");
    }

    // temperature and humidity
    ht_sensor = new HTS221Sensor(*ext_i2c);
    if (ht_sensor == NULL)
    {
        Screen.print(0, "Error \r\n ht_sensor");
    }

    ht_sensor->init(NULL);
    ht_sensor->reset();
}

void loop()
{
    uint64_t ms = SystemTickCounterRead() - msReadEnvData;
    if (ms < READ_ENV_INTERVAL)
    {
        return;
    }
    float temp = 0;
    ht_sensor->getTemperature(&temp);
    float humidity = 0;
    ht_sensor->getHumidity(&humidity);

    snprintf(buffInfo, sizeof(buffInfo), "Leicester\r\n temp: %.2f \n humidity: %.2f", temp, humidity);
    textOutDevKitScreen(0, buffInfo, 1);
    msReadEnvData = SystemTickCounterRead();

    // switch on rgb led while posting data
    rgbLed.setColor(185, 24, 23);

    // POST sensor data
    sendData(temp, humidity);

    // turn off rgb led
    rgbLed.turnOff();
}

void sendData(float temp, float humidity)
{
    httpRequest(HTTP_POST, "http://192.168.0.77:3000", "{location:\"Leicester\",humidity:\"" + String(humidity) + "\",temperature:\"" + String(temp) + "\"}");
}

const Http_Response *httpRequest(http_method method, String url, String body)
{
    char urlBuf[128];
    url.toCharArray(urlBuf, 128);

    HTTPClient *httpClient = new HTTPClient(method, urlBuf);
    httpClient->set_header("Content-Type", "application/json"); // required for posting data in the body

    char bodyBuf[256];
    url.toCharArray(bodyBuf, 256);
    const Http_Response *result = httpClient->send(bodyBuf, strlen(bodyBuf));

    if (result == NULL)
    {
        Screen.print(1, "Failed");
        char errorBuf[10];
        String(httpClient->get_error()).toCharArray(errorBuf, 10);
        Screen.print(1, errorBuf);
    }
    return result;
}