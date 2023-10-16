const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  availability: {
    type: [
      {
        weekNumber: {
          type: Number,
          required: true,
        },
        intervals: {
          type: [
            {
              intervalNumber: {
                type: Number,
                required: true,
              },
              availableDays: {
                type: [
                  {
                    day: {
                      type: String,
                      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      required: true,
                    },
                  },
                ],
                required: true,
              },
            },
          ],
          default: [],
        },
      },
    ],
    required: true,
    default: [],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
