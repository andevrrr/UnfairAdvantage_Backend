const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const MONGO_DB_URI = process.env.MONGO_DB_URL;

// const user1 = new User({
//     username: 'sampleUser',
//     availability: [
//       {
//         weekNumber: 1,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Mon' },
//               { day: 'Tue' },
//             ],
//           },
//           {
//             intervalNumber: 2,
//             availableDays: [
//               { day: 'Thu' },
//               { day: 'Fri' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 2,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Mon' },
//               { day: 'Tue' },
//             ],
//           },
//           {
//             intervalNumber: 2,
//             availableDays: [
//               { day: 'Wed' },
//               { day: 'Thu' },
//               { day: 'Fri' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 3,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Mon' },
//               { day: 'Tue' },
//               { day: 'Wed' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 4,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Fri' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 5,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Sat' },
//               { day: 'Sun' },
//             ],
//           },
//           {
//             intervalNumber: 2,
//             availableDays: [
//               { day: 'Mon' },
//               { day: 'Tue' },
//               { day: 'Wed' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 6,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Tue' },
//               { day: 'Wed' },
//             ],
//           },
//           {
//             intervalNumber: 2,
//             availableDays: [
//               { day: 'Sat' },
//             ],
//           },
//         ],
//       },
//       {
//         weekNumber: 7,
//         intervals: [
//           {
//             intervalNumber: 1,
//             availableDays: [
//               { day: 'Sun' },
//             ],
//           },
//         ],
//       },
//     ],
//   });
  
// user1.save()
//     .then(() => {
//       console.log('Sample user created successfully');
//     })
//     .catch((error) => {
//       console.error('Error creating sample user:', error);
//     })
//     .finally(() => {
//       mongoose.connection.close();
//     });


app.get("/users/:username/availability", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ availability: user.availability });
  } catch (error) {
    console.error("Error fetching user availability:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users/:username/availability", async (req, res) => {
    const { username } = req.params;
    const { updates } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      updates.forEach((update) => {
        const { weekNumber, intervals } = update;

        console.log(update)
  
        if (!weekNumber || !Number.isInteger(weekNumber) || !Array.isArray(intervals)) {
          return res.status(400).json({ message: "Invalid data provided" });
        }
  
        const index = user.availability.findIndex((week) => week.weekNumber === weekNumber);
  
        if (index !== -1) {
          intervals.forEach((newInterval) => {
            const { intervalNumber, availableDays } = newInterval;
  
            if (!intervalNumber || !Number.isInteger(intervalNumber) || !Array.isArray(availableDays)) {
              return res.status(400).json({ message: "Invalid interval data provided" });
            }
  
            const intervalIndex = user.availability[index].intervals.findIndex(
              (interval) => interval.intervalNumber === intervalNumber
            );
  
            if (intervalIndex !== -1) {
              user.availability[index].intervals[intervalIndex].availableDays = availableDays;
            }
          });
        }
      });
  
      await user.save();
  
      res.json({ message: "Availability updated successfully", updatedAvailability: user.availability });
    } catch (error) {
      console.error("Error updating user availability:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.delete('/:username/delete-interval/:id', async (req, res) => {
    const { username, id } = req.params;
  
    try {
      const result = await User.updateOne(
        { username, 'availability.intervals._id': id },
        { $pull: { 'availability.$.intervals': { _id: id } } }
      );
  
      if (result.nModified > 0) {
        res.status(200).json({ message: 'Interval deleted successfully' });
      } else {
        res.status(404).json({ error: 'Interval not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

app.use((req, res) => {
  res.send("Hello World");
});

mongoose
  .connect(MONGO_DB_URI)
  .then((result) => {
    console.log("Connected to the database successfully!");
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
