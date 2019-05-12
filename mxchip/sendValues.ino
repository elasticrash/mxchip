#include "AZ3166WiFi.h"
#include "Arduino.h"
#include "http_client.h"
#include "Sensor.h"
#include "SystemTickCounter.h"
#include "RGB_LED.h"

int status = WL_IDLE_STATUS;
static char buffInfo[128];
static RGB_LED rgbLed;
int INTERVAL = 5000;
int send_interval_ms = 0;
static volatile uint64_t msReadEnvData = 0;
#define READ_ENV_INTERVAL 120000
static HTS221Sensor *ht_sensor;
static DevI2C *ext_i2c;
static bool hasWifi = false;

void setup()
{
    Serial.begin(115200);
    Screen.init();
    initSensors();
    Screen.print(0, "HOME \r\n Welcome");

    delay(1000);
    initWiFi();
    delay(3000);
}

void initWiFi()
{
    if (WiFi.begin() == WL_CONNECTED)
    {
        IPAddress ip = WiFi.localIP();
        Screen.print(1, ip.get_address());
        hasWifi = true;
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

float readTemperature()
{
    ht_sensor->reset();

    float temperature = 0;
    ht_sensor->getTemperature(&temperature);

    return temperature;
}

float readHumidity()
{
    ht_sensor->reset();

    float humidity = 0;
    ht_sensor->getHumidity(&humidity);

    return humidity;
}

void loop()
{
    if (hasWifi)
    {
        uint64_t ms = SystemTickCounterRead() - msReadEnvData;
        if (ms < READ_ENV_INTERVAL)
        {
            return;
        }
        float temperature = readTemperature();
        float humidity = readHumidity();

        displayLines("Leicester", "Temp:" + String(temperature), "Hum: " + String(humidity));
        msReadEnvData = SystemTickCounterRead();

        // switch on rgb led while posting data
        rgbLed.setColor(185, 24, 23);

        // POST sensor data
        sendData(temperature, humidity);

        // turn off rgb led
        rgbLed.turnOff();
    }
}

void displayLines(String line1, String line2, String line3)
{
    char screenBuff[128];
    line1.toCharArray(screenBuff, 128);
    Screen.print(0, screenBuff);

    line2.toCharArray(screenBuff, 128);
    Screen.print(1, screenBuff);

    line3.toCharArray(screenBuff, 128);
    Screen.print(2, screenBuff);
}

void sendData(float temp, float humidity)
{
    httpRequest(HTTP_POST, "http://192.168.0.77:3000/", "{\"location\":\"Leicester\",\"humidity\":\"" + String(humidity) + "\",\"temperature\":\"" + String(temp) + "\"}");
}

const Http_Response *httpRequest(http_method method, String url, String body)
{
    Screen.print(3, "Sending Data");

    char urlBuf[48];
    url.toCharArray(urlBuf, 48);

    HTTPClient *httpClient = new HTTPClient(method, urlBuf);
    httpClient->set_header("Content-Type", "application/json"); // required for posting data in the body

    char bodyBuf[256];
    body.toCharArray(bodyBuf, 256);
    const Http_Response *result = httpClient->send(bodyBuf, strlen(bodyBuf));

    if (result == NULL)
    {
        Screen.print(1, "Failed");
        char errorBuf[10];
        String(httpClient->get_error()).toCharArray(errorBuf, 10);
        Screen.print(1, errorBuf);
        return result;
    }

    Screen.print(3, "Success");

    String(result->body).toCharArray(buffInfo, 128);
    Screen.print(3, buffInfo);

    Serial.print(result->status_code);
    Serial.print(result->status_message);

    delete httpClient;

    return result;
}