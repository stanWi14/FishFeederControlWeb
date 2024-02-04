// codeTemplate.js
const firmwareTemplate = 



`
  // Your existing code here

  #include <Arduino.h> 
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <ArduinoJson.h> 
#include <ESP32Servo.h>
#include <time.h>
#include <Preferences.h>

#define apiKey "AIzaSyDReoy6uwXV2Z3kM76DEQaldj5y1Aruoag" 
#define projectId "fish-feeder-9341e"
#define userEmail "fishfeederdeviceKMS@gmail.com";
#define emailPassword "FishfeederKMS11" 

#define TRIGPIN 26
#define ECHOPIN 25
#define SERVOPIN 14
#define BUTTON 4
#define LED 2

Preferences preferences;

const char* ssid = "FishFeeder";     
const char* password = "P15HF3ED3rD3V1C3"; 
const int serverPort = 80;       
String deviceId = "{deviceId}"; 
WiFiServer server(serverPort);
const char* CONNECTED_MSG = "New client connected";
const char* RECEIVED_MSG = "Received from client: ";
String devUID = "0"; 
long duration;
int distance;
Servo myServo; 
int pos = 0;

FirebaseData fbdo;
FirebaseJson payload;
FirebaseJsonData jsonData;
FirebaseAuth auth;
FirebaseConfig config;

bool taskCompleted = false;
bool isPairing = false;
unsigned long dataMillis = 0;
String savedSSID = "";
String savedPassword = "";
String savedLastFeeding = "";
int savedAfterFeedVol = 0;
bool isFoodTankOffline = false;
String* values = nullptr; 
int savedSize = 0;

void updateDocumentUID(String UID) {
  FirebaseJson content;
  String documentPath = "Devices/" + deviceId;
  Serial.println("Mencoba update UID... ");
  content.clear();
  content.set("fields/ownerUID/stringValue", UID);
  if (Firebase.Firestore.patchDocument(&fbdo, projectId, "", documentPath.c_str(), content.raw(), "ownerUID")) {
    Serial.printf("BERHASIL\n%s\n\n", fbdo.payload().c_str());
  }
  else {
    Serial.println(fbdo.errorReason());
  }
}
unsigned long cooldownStartTime = 0;
const unsigned long cooldownDuration = 5000; 

void onLED() {
  unsigned long currentTime = millis();
  if (currentTime - cooldownStartTime >= cooldownDuration) {
    for (int i=0; i<5; i++) {
      digitalWrite(LED, HIGH);  
      delay(100);               
      digitalWrite(LED, LOW);  
      delay(100); 
    }  
    cooldownStartTime = currentTime;
  }
}

void updateUltrasonicOnly(int afterFeed) {
  FirebaseJson content;
  String documentPath = "Devices/" + deviceId;
  Serial.println("Mencoba update a document... ");
  content.clear();
  content.set("fields/afterFeedVol/integerValue", afterFeed);
  if (Firebase.Firestore.patchDocument(&fbdo, projectId, "" , documentPath.c_str(), content.raw(), "afterFeedVol" )) {
    isFoodTankOffline = false;
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
  }
  else {
    Serial.println(fbdo.errorReason());
  }
}
unsigned long lastConnectionTime = 0; 
const unsigned long connectionDelay = 5000;

void WifiClientServer() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println(CONNECTED_MSG);
    lastConnectionTime = millis();
    digitalWrite(LED, HIGH);
    while (client.connected()) {
      if (client.available()) {
        String request = client.readStringUntil('\r');
        Serial.println(RECEIVED_MSG + request);
        int firstDelimiter = request.indexOf('#');
        int secondDelimiter = request.indexOf('#', firstDelimiter + 1);
        if (firstDelimiter != -1 && secondDelimiter != -1) {
          String newWifiSSID = request.substring(0, firstDelimiter);
          String newWifiPass = request.substring(firstDelimiter + 1, secondDelimiter);
          devUID = request.substring(secondDelimiter + 1);
          Serial.println("newWifiSSID: " + newWifiSSID);
          Serial.println("newWifiPass: " + newWifiPass);
          Serial.println("UID: " + devUID);
          preferences.begin("my-app", false);
          preferences.clear();
          String newSSID = newWifiSSID;
          String newPassword = newWifiPass;
          preferences.putString("wifi_ssid", newSSID.c_str());
          preferences.putString("wifi_password", newPassword.c_str());
          Serial.println("BERHASIL SAVE FLASH MEMORY");
          preferences.end();
          bool isPairing = false;
          if (client.println(deviceId) > 0) {
            Serial.println("Sent response to client: " + deviceId);
            delay(5000);
            WiFi.softAPdisconnect(true);
            WiFi.begin(newWifiSSID.c_str(), newWifiPass.c_str());
            Serial.print(".");
            int connectionAttempts = 0;
            while (WiFi.status() != WL_CONNECTED && connectionAttempts <= 5) {
              delay(1000);
              Serial.print(".");
              connectionAttempts++;
            }
            if (WiFi.status() == WL_CONNECTED) {
              Serial.println("Connected to new WiFi network");
              int nilaiUltrasonic = ultrasonic();
              updateUltrasonicOnly(nilaiUltrasonic);
            } else {
              if (!isPairing) {
                onLED();
              }
              WiFi.disconnect();
              Serial.println("clearing preferences flash memory");
              preferences.begin("my-app", false);
              preferences.clear();
              Serial.println("BERHASIL CLEAR FLASH MEMORY");
              preferences.end();
              delete[] values;
              WiFi.softAP(ssid, password);
              Serial.println();
              Serial.print("ESP32 IP address: ");
              Serial.println(WiFi.softAPIP());
              server.begin();
              Serial.println("Server started");

              bool isPairing = true;
              digitalWrite(LED, HIGH);
            }
          } else {
            Serial.println("Failed to send response to client");
          }     
        } else {
          Serial.println("Invalid request format");
        }
      }
      unsigned long elapsedTime = millis() - lastConnectionTime;
    }
    client.stop();
    Serial.println("Client disconnected");
    digitalWrite(LED, LOW);
  }
}


void updateDocumentUltrasonic(int afterFeed, String timeNow) {
  FirebaseJson content;
  String documentPath = "Devices/" + deviceId;
  Serial.println("Mencoba update a document... ");
  content.clear();
  content.set("fields/afterFeedVol/integerValue", afterFeed);
  content.set("fields/lastFeedTime/stringValue", timeNow);
  if (Firebase.Firestore.patchDocument(&fbdo, projectId, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw(), "afterFeedVol, lastFeedTime" /* updateMask */)) {
    isFoodTankOffline = false;
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
  }
  else {
    isFoodTankOffline = true;
    Serial.println(fbdo.errorReason());
    savedLastFeeding = timeNow;
    savedAfterFeedVol = afterFeed;
    Serial.println(savedLastFeeding + "(DHHSS) After: " + savedAfterFeedVol);
  }
}

String getTime() {
  time_t now;
  struct tm timeinfo;
  char strftime_buf[64];
  delay(1000);

  for (int i=0; i<15; i++) {
    if(!getLocalTime(&timeinfo)){
      Serial.println("Failed to obtain time");
    }
    delay(500);
  }
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return "Failed to obtain time";
  }
  time(&now);
  int day = timeinfo.tm_wday == 0 ? 7 : timeinfo.tm_wday;
  localtime_r(&now, &timeinfo);
  strftime(strftime_buf, sizeof(strftime_buf), "%m%d%H%M", &timeinfo);
  String timeStr = strftime_buf;
  return timeStr;
}

bool ultrasonicRetry = false;
String timeRetry = "";
int ultrasonic() {
int totalDuration = 0;
int numberOfReadings = 10;
int readings[numberOfReadings];
  for (int i = 0; i < numberOfReadings; i++) {
    delay(250);
    digitalWrite(TRIGPIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIGPIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIGPIN, LOW);
    duration = pulseIn(ECHOPIN, HIGH);
    digitalWrite(ECHOPIN, LOW);
    delayMicroseconds(2);  // 
    Serial.println(duration);
    readings[i] = duration;
    totalDuration += readings[i];
  }
  int averageDuration = totalDuration / numberOfReadings;
  Serial.print("Durasi (Sebelum Penyaringan): ");
  Serial.print(averageDuration);
  Serial.println(" us");
  for (int i = 0; i < numberOfReadings; i++) {
    if (abs(readings[i] - averageDuration) > 300) {  
      Serial.print("dibuang: ");
      Serial.println(readings[i]);
      totalDuration -= readings[i];
      numberOfReadings--; 
    }
  }

  averageDuration = totalDuration / numberOfReadings;
  Serial.print("Durasi (Setelah Penyaringan): ");
  Serial.print(averageDuration);
  Serial.println(" us");
  distance = averageDuration * 0.34 / 2;
  Serial.print("Jarak: ");
  Serial.print(distance);
  Serial.println(" mm");

  if (distance > 240 || duration > 1370) {
    Serial.println("ULTRA RETRY TRUE");
    ultrasonicRetry = true;
  } else {
    Serial.println("ULTRA RETRY FALSE");
    ultrasonicRetry = false;
  }
  Serial.print("distamce: ");
  Serial.print(distance);
  int tankPercentage;
  if (distance < 30) {
    tankPercentage = 100;  
  } else if (distance > 230) {
    tankPercentage = 0;    
  } else {
    tankPercentage = map(distance, 30, 230, 100, 0);
  }
  Serial.print("Persentase Tangki: ");
  Serial.print(tankPercentage);
  Serial.println("%");
  Serial.println(" ");
  return tankPercentage;
}

void checkTimeAndUltrasonic(String currentTime, String values[], int arraySize) {
  for (int i = 0; i < arraySize; i++) {
    String currentValue = values[i];
    String extractedTime = currentValue.substring(0, 4);  // Mengambil empat digit pertama sebagai waktu

    if (currentTime.equals(extractedTime)) {
      int afterFeed = ultrasonic();
      String timeNow = getTime();
      Serial.print("Ultrasonic: ");
      Serial.println(afterFeed);
      Serial.print("Time Ultrasonic: ");
      Serial.println(timeNow);
      if (!ultrasonicRetry) {
        Serial.println("cektime RETRY FALSE");
        updateDocumentUltrasonic(afterFeed, timeNow);
      } else {
        Serial.println("cektime RETRY TRUE");
        timeRetry = timeNow;
      }

      break;
    }
  }
}

void servo(int putaran) {
  Serial.print("Putaran : ");
  Serial.println(putaran);
  for (int i = 0; i < putaran; i++) {
    myServo.write(7);             
    delay(300);                       
    myServo.write(0); 
    delay(300);                
  }
}

void checkTimeAndRotateServo(String currentTime, String values[], int arraySize) {
  for (int i = 0; i < arraySize; i++) {
    String currentValue = values[i];
    String extractedTime = currentValue.substring(0, 4);  
    String extractedRotation = currentValue.substring(4);
  
    if (currentTime.equals(extractedTime)) {
        String rotation = extractedRotation;
        servo(rotation.toInt()); 
        break;
    }
  }
}

bool jsonError = false;
void parseJsonAndExtractValues(const char* json, String day, String*& values, int& size) {
  DynamicJsonDocument doc(4096); 
  DeserializationError error = deserializeJson(doc, json);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    jsonError = true;
    return;
  }

  jsonError = false;
  JsonArray array = doc["fields"][day]["arrayValue"]["values"];
  size = array.size();
  values = new String[size]; 
  int index = 0;
  for (JsonVariant v : array) {
    if (v["stringValue"]) {
      String valueString = v["stringValue"].as<String>();
      values[index] = valueString; 
      index++;
    }
  }
}

void fcsUploadCallback(CFS_UploadStatusInfo info) {
    if (info.status == fb_esp_cfs_upload_status_init)
    {
        Serial.printf("\nUploading data (%d)...\n", info.size);
    }
    else if (info.status == fb_esp_cfs_upload_status_upload)
    {
        Serial.printf("Uploaded %d%s\n", (int)info.progress, "%");
    }
    else if (info.status == fb_esp_cfs_upload_status_complete)
    {
        Serial.println("Upload completed ");
    }
    else if (info.status == fb_esp_cfs_upload_status_process_response)
    {
        Serial.print("Processing the response... ");
    }
    else if (info.status == fb_esp_cfs_upload_status_error)
    {
        Serial.printf("Upload failed, %s\n", info.errorMsg.c_str());
    }
}

void printLocalTime() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
}

String getClock() {
  time_t now;
  struct tm timeinfo;
  char strftime_buf[64];
  delay(1000);
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return "0000";
  }
  time(&now);
  localtime_r(&now, &timeinfo);
  strftime(strftime_buf, sizeof(strftime_buf), "%H%M", &timeinfo);
  return String(strftime_buf);
}

String getToday() {
  time_t now;
  struct tm timeinfo;
  char strftime_buf[64];
  delay(1000);
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    String a = "Failed";
    return a;
  }
  time(&now);
  localtime_r(&now, &timeinfo);
  strftime(strftime_buf, sizeof(strftime_buf), "%A", &timeinfo);
  String a = strftime_buf;
  return a;
}

void checkSavedWifiFirst() {
  preferences.begin("my-app", false);
  if (preferences.isKey("wifi_ssid") && preferences.isKey("wifi_password")) {
    savedSSID = preferences.getString("wifi_ssid", "");
    savedPassword = preferences.getString("wifi_password", "");
    preferences.end();
    if (savedSSID.length() > 0 && savedPassword.length() > 0) {
      Serial.println("SSID dan password sudah tersimpan:");
      Serial.println("SSID: " + savedSSID);
      Serial.println("Password: " + savedPassword);
      WiFi.begin(savedSSID, savedPassword);
      for (int i = 0; i < 5; i++) {
        if (WiFi.status() != WL_CONNECTED) {
          delay(1000);
          Serial.print(".");
        }
      }
      if (WiFi.status() == WL_CONNECTED) {
        int nilaiUltrasonic = ultrasonic();
        updateUltrasonicOnly(nilaiUltrasonic);
      }
    } else {
    delete[] values;

    WiFi.softAP(ssid, password);
    Serial.println();
    Serial.print("ESP32 IP address: ");
    Serial.println(WiFi.softAPIP());
    server.begin();
    Serial.println("Server started");
    bool isPairing = true;
    digitalWrite(LED, HIGH);
  }

  } else {
    delete[] values;
    WiFi.softAP(ssid, password);
    Serial.println();
    Serial.print("ESP32 IP address: ");
    Serial.println(WiFi.softAPIP());
    server.begin();
    Serial.println("Server started");
    bool isPairing = true;
    digitalWrite(LED, HIGH);
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    if (!isPairing) {
      onLED();
    }
  }
}

void checkSavedWifi() {
  if (savedSSID.length() > 0 && savedPassword.length() > 0) {
    Serial.println("SSID dan password sudah tersimpan:");
    Serial.println("SSID: " + savedSSID);
    Serial.println("Password: " + savedPassword);

    WiFi.begin(savedSSID, savedPassword);
    for (int i = 0; i < 5; i++) {
      if (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
      }
    }
    if (WiFi.status() == WL_CONNECTED) {
      int nilaiUltrasonic = ultrasonic();
      updateUltrasonicOnly(nilaiUltrasonic);
    }
  } else {
    delete[] values;
    WiFi.softAP(ssid, password);
    Serial.println();
    Serial.print("ESP32 IP address: ");
    Serial.println(WiFi.softAPIP());
    server.begin();
    Serial.println("Server started");
    bool isPairing = true;
    digitalWrite(LED, HIGH);
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    if (!isPairing) {
      onLED();
    }
  }
}

void isButtonClicked() {
  int buttonState = digitalRead(BUTTON);
  if (!buttonState) {
    digitalWrite(LED, HIGH);
    savedSSID = "";
    savedPassword = "";
    updateDocumentUID("");
    WiFi.disconnect();
    Serial.println("clearing preferences flash memory");
    preferences.begin("my-app", false);
    preferences.clear();
    Serial.println("BERHASIL CLEAR FLASH MEMORY");
    preferences.end();
    delete[] values;
    WiFi.softAP(ssid, password);
    Serial.println();
    Serial.print("ESP32 IP address: ");
    Serial.println(WiFi.softAPIP());
    server.begin();
    Serial.println("Server started");
    digitalWrite(LED, LOW);
    bool isPairing = true;
    digitalWrite(LED, HIGH);
  } 
}

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  myServo.attach(SERVOPIN); 
  myServo.write(pos); 
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  Serial.begin(115200);
  Serial.println("");
  Serial.println("Project connected");
  Serial.println(WiFi.localIP());
  Serial.println("");
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  config.api_key = apiKey;
  auth.user.email = userEmail;
  auth.user.password = emailPassword;
  config.token_status_callback = tokenStatusCallback;
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  config.cfs.upload_callback = fcsUploadCallback;
  configTime(7 * 3600, 0, "pool.ntp.org");
  checkSavedWifiFirst();
}
unsigned long previousMillis = 0;  
const int interval = 10000; 

void loop() {  
  isButtonClicked();
  WifiClientServer();
  String jam = getClock();
  if (WiFi.status() == WL_CONNECTED) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      if (ultrasonicRetry) {
        Serial.println("COBA ULTRASONIC RETRY");
        int nilaiUltraRetry = ultrasonic();
        String waktuTimeRetry = timeRetry;
        if (!ultrasonicRetry) {
          Serial.println("RETRY BERHASIL");
          Serial.println("ultrasonic RETRY");
          updateDocumentUltrasonic(nilaiUltraRetry, waktuTimeRetry);
          Serial.println(nilaiUltraRetry);
          Serial.println("waktu RETRY");
          Serial.println(waktuTimeRetry);
        }
      }
    }
    while (!Firebase.ready()) {
      Firebase.ready();
      Serial.print(".");
    }
    if (Firebase.ready() && (millis() - dataMillis > 60000 || dataMillis == 0))
    {
      String today = "";
      today = getToday();
      dataMillis = millis();
      Serial.print("HARI INII: ");
      Serial.println(today);
      String documentPath = "Schedules/" + deviceId;
      String mask = today;
      Serial.print("Mencoba Get a document... ");
      if (Firebase.Firestore.getDocument(&fbdo, projectId, "", documentPath.c_str(), mask.c_str())) {
        const char* a = fbdo.payload().c_str();
        Serial.println("Get a document... ok");
        Serial.println(a);
        printLocalTime();
        String* newValues;
        int newSize;
        parseJsonAndExtractValues(a, today, newValues, newSize);
        Serial.println(jam);
        if (!jsonError) {
          delete[] values; 
          values = newValues; 
          savedSize = newSize;
        }
        Serial.println("Wifi NYALA");
        if (isFoodTankOffline) {
          Serial.println("Food tank ofline TRUE");
          updateDocumentUltrasonic(savedAfterFeedVol, savedLastFeeding);
        }
        Serial.println("WIFI TELAH NYALA : " + savedLastFeeding);
        for (int i = 0; i < savedSize; i++) {
          Serial.print("Nilai DARI IF");
          Serial.print(i);
          Serial.print(": ");
          Serial.println(values[i]);
        }
        checkTimeAndRotateServo(jam, values, savedSize);
        checkTimeAndUltrasonic(jam, values, savedSize);     
      } else {
        Serial.println(fbdo.errorReason());
        Serial.println("Wifi PUTUS");
        Serial.println(jam);
        for (int i = 0; i < savedSize; i++) {
          Serial.print("Nilai DARI ELSE");
          Serial.print(i);
          Serial.print(": ");
          Serial.println(values[i]);
        }
        checkTimeAndRotateServo(jam, values, savedSize);
        checkTimeAndUltrasonic(jam, values, savedSize); 
      }
    }
  } else {
    Serial.println("WIFI DISCONECTED BANG!!!");
    if (!isPairing) {
      onLED();
    }
    checkSavedWifi();
    Serial.println("MASUK Wifi LEPASS BANG!!!");
    String jam = getClock();
    if ( (values && savedSize && (millis() - dataMillis > 60000)) || (values && savedSize &&(dataMillis == 0)) ) {
      dataMillis = millis();
      Serial.println("MASUK VALUE SAVED SIZE Wifi LEPASS BANG!!!");
      Serial.println(jam);
      for (int i = 0; i < savedSize; i++) {
        Serial.print("Nilai DARI ELSE");
        Serial.print(i);
        Serial.print(": ");
        Serial.println(values[i]);
      }
      checkTimeAndRotateServo(jam, values, savedSize);
      checkTimeAndUltrasonic(jam, values, savedSize);
    }
  }
}



  // More of your existing code here
`;

export default firmwareTemplate;
