// Yellowstone Example.
//
// Connects to the specified RTSP server url,
// Once connected, opens a file and streams H264 and AAC to the files
//
// Yellowstone is written in TypeScript. This example uses Javascript and
// the typescript compiled files in the ./dist folder

const { RTSPClient, H264Transport, AACTransport } = require("../dist");
const fs = require("fs");

// User-specified details here.
const url = "rtsp://192.168.199.229/1";
const filename = "camera";
const username = "";
const password = "";

// Step 1: Create an RTSPClient instance
const client = new RTSPClient(username, password);

// Step 2: Connect to a specified URL using the client instance.
//
// "keepAlive" option is set to true by default
// "connection" option is set to "udp" by default.
client.connect(url, { connection: "tcp" })
  .then((detailsArray) => {
    console.log("Connected");

    for (let x = 0; x < detailsArray.length; x++) {
      let details = detailsArray[x];
      console.log(`Stream ${x}. Codec is`, details.codec);

      // Step 3: Open the output file
      if (details.codec == "H264") {
        // const videoFile = fs.createWriteStream(filename + '.264');
        // Step 4: Create H264Transport passing in the client, file, and details
        // This class subscribes to the 'data' event, looking for the video payload
        // const h264 = new H264Transport(client, videoFile, details);
      }
      if (details.codec == "AAC") {
        const audioFile = fs.createWriteStream(filename + '.aac');
        // Add AAC Transport
        // This class subscribes to the 'data' event, looking for the audio payload
        const aac = new AACTransport(client, audioFile, details);
      }
    }

    // Step 5: Start streaming!
    client.play();
  })
  .catch(e => console.log(e));

// let i = 0
// The "data" event is fired for every RTP packet.
client.on("data", (channel, data, packet) => {
  // todo: 这儿有巨大的性能问题，我查到每s有200次call
  // i++
  // console.log(i++)
  console.log(data)
  // console.log("RTP:", "Channel=" + channel, "TYPE=" + packet.payloadType, "ID=" + packet.id, "TS=" + packet.timestamp, "M=" + packet.marker);
});

// The "controlData" event is fired for every RTCP packet.
client.on("controlData", (channel, rtcpPacket) => {
  console.log("RTCP:", "Channel=" + channel, "TS=" + rtcpPacket.timestamp, "PT=" + rtcpPacket.packetType);
});

// The "log" event allows you to optionally log any output from the library.
// You can hook this into your own logging system super easily.
/*
client.on("log", (data, prefix) => {
  console.log(prefix + ": " + data);
});
*/
