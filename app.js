// require('dotenv').config();

// const express = require('express');
// const http = require('http');
// const session = require('express-session');
// const mongoose = require('mongoose');
// const path = require('path');
// const { Server } = require('socket.io');

// const User = require('./models/user');
// const Appointment = require('./models/Appointment');
// const Message = require('./models/Message');
// const Otp = require('./models/Otp');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: true,
//     credentials: true
//   }
// });
// const PORT = Number(process.env.PORT) || 3000;
// const MONGO_URI = process.env.MONGO_URI;
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'Medconnect';
// const MONGO_FALLBACK_URI =
//   process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017';
// const MONGO_CONNECT_TIMEOUT_MS =
//   Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 5000;
// const OTP_EXPIRY_MS = 5 * 60 * 1000;
// const DEMO_OTP = '1234';
// const activeUsers = new Map();

// if (!MONGO_URI) {
//   throw new Error('Missing MONGO_URI in environment');
// }

// const demoUsers = [
//   {
//     name: 'Amit Kumar',
//     phone: '9876543210',
//     role: 'patient',
//     email: 'amit.kumar@email.com',
//     age: 28,
//     gender: 'Male'
//   },
//   {
//     name: 'Dr. Rahul Sharma',
//     phone: '9123456780',
//     role: 'doctor',
//     specialization: 'General Physician',
//     experience: '10 years',
//     fee: 500,
//     rating: 4.9,
//     reviews: 120
//   },
//   {
//     name: 'Dr. Divya Nair',
//     phone: '9000000001',
//     role: 'doctor',
//     specialization: 'Dermatologist',
//     experience: '7 years',
//     fee: 600,
//     rating: 4.8,
//     reviews: 85
//   },
//   {
//     name: 'Dr. Amit Patel',
//     phone: '9000000002',
//     role: 'doctor',
//     specialization: 'Cardiologist',
//     experience: '15 years',
//     fee: 800,
//     rating: 4.9,
//     reviews: 200
//   },
//   {
//     name: 'Dr. Suresh Kumar',
//     phone: '9000000003',
//     role: 'doctor',
//     specialization: 'Nutritionist',
//     experience: '5 years',
//     fee: 400,
//     rating: 4.7,
//     reviews: 60
//   },
//   {
//     name: 'Sunita Patel',
//     phone: '9111111111',
//     role: 'patient',
//     email: 'sunita@email.com',
//     age: 35,
//     gender: 'Female'
//   },
//   {
//     name: 'Rajesh Jain',
//     phone: '9222222222',
//     role: 'patient',
//     email: 'rajesh@email.com',
//     age: 45,
//     gender: 'Male'
//   }
// ];

// const pageRoutes = {
//   '/': 'index.html',
//   '/patient-dashboard': 'patient-dashboard.html',
//   '/doctor-dashboard': 'doctor-dashboard.html',
//   '/appointment': 'appointment.html',
//   '/chat': 'chat.html',
//   '/payment': 'payment.html',
//   '/prescription': 'prescription.html',
//   '/documents': 'documents.html'
// };

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'medconnect-secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000
//     }
//   })
// );

// function asyncHandler(handler) {
//   return (req, res, next) => {
//     Promise.resolve(handler(req, res, next)).catch(next);
//   };
// }

// function getInitials(name = '') {
//   return name
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((part) => part[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();
// }

// function todayStr() {
//   return new Date().toISOString().split('T')[0];
// }

// function monthBounds() {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth();
//   const start = new Date(Date.UTC(year, month, 1));
//   const end = new Date(Date.UTC(year, month + 1, 0));
//   return {
//     start: start.toISOString().split('T')[0],
//     end: end.toISOString().split('T')[0]
//   };
// }

// function formatTime(dateValue) {
//   return new Date(dateValue).toLocaleTimeString('en-IN', {
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true
//   });
// }

// function serializeUser(userDoc, options = {}) {
//   if (!userDoc) {
//     return null;
//   }

//   const user =
//     typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
//   const userId = String(user._id || user.id);

//   return {
//     id: userId,
//     name: user.name,
//     phone: user.phone,
//     role: user.role,
//     initials: user.initials || getInitials(user.name),
//     email: user.email || '',
//     age: user.age ?? null,
//     gender: user.gender || '',
//     specialization: user.specialization || '',
//     experience: user.experience || '',
//     fee: user.fee ?? 0,
//     rating: user.rating ?? 0,
//     reviews: user.reviews ?? 0,
//     isOnline: options.isOnline ?? activeUsers.has(userId),
//     lastSeenAt: user.lastSeenAt || null
//   };
// }

// function serializeAppointment(appointmentDoc) {
//   const appointment =
//     typeof appointmentDoc.toObject === 'function'
//       ? appointmentDoc.toObject()
//       : { ...appointmentDoc };

//   const populatedPatient =
//     appointment.patientId && typeof appointment.patientId === 'object'
//       ? serializeUser(appointment.patientId)
//       : null;
//   const populatedDoctor =
//     appointment.doctorId && typeof appointment.doctorId === 'object'
//       ? serializeUser(appointment.doctorId)
//       : null;

//   return {
//     id: String(appointment._id || appointment.id),
//     patientId: populatedPatient
//       ? populatedPatient.id
//       : String(appointment.patientId),
//     doctorId: populatedDoctor
//       ? populatedDoctor.id
//       : String(appointment.doctorId),
//     date: appointment.date,
//     time: appointment.time,
//     type: appointment.type,
//     status: appointment.status,
//     symptoms: appointment.symptoms || '',
//     fee: appointment.fee ?? 0,
//     patient: populatedPatient,
//     doctor: populatedDoctor,
//     createdAt: appointment.createdAt,
//     updatedAt: appointment.updatedAt
//   };
// }

// function serializeMessage(messageDoc) {
//   const message =
//     typeof messageDoc.toObject === 'function' ? messageDoc.toObject() : { ...messageDoc };

//   return {
//     id: String(message._id || message.id),
//     senderId:
//       message.senderId && typeof message.senderId === 'object'
//         ? String(message.senderId._id)
//         : String(message.senderId),
//     receiverId:
//       message.receiverId && typeof message.receiverId === 'object'
//         ? String(message.receiverId._id)
//         : String(message.receiverId),
//     content: message.content,
//     timestamp: formatTime(message.createdAt || new Date()),
//     createdAt: message.createdAt,
//     readAt: message.readAt || null,
//     status: message.readAt ? 'seen' : 'sent'
//   };
// }

// function addActiveSocket(userId, socketId) {
//   const existing = activeUsers.get(userId) || new Set();
//   existing.add(socketId);
//   activeUsers.set(userId, existing);
// }

// function removeActiveSocket(userId, socketId) {
//   if (!userId || !activeUsers.has(userId)) {
//     return false;
//   }

//   const sockets = activeUsers.get(userId);
//   sockets.delete(socketId);

//   if (sockets.size === 0) {
//     activeUsers.delete(userId);
//     return true;
//   }

//   return false;
// }

// function emitToUser(userId, eventName, payload) {
//   const sockets = activeUsers.get(String(userId));
//   if (!sockets) {
//     return;
//   }

//   for (const socketId of sockets) {
//     io.to(socketId).emit(eventName, payload);
//   }
// }

// function broadcastUserStatus(userId, isOnline, lastSeenAt = null) {
//   io.emit('user-status', {
//     userId: String(userId),
//     isOnline,
//     lastSeenAt
//   });
// }

// function requireAuth(role) {
//   return asyncHandler(async (req, res, next) => {
//     if (!req.session.userId) {
//       return res.status(401).json({ error: 'Not logged in' });
//     }

//     const user = await User.findById(req.session.userId);
//     if (!user) {
//       req.session.destroy(() => {});
//       return res.status(401).json({ error: 'Session expired' });
//     }

//     if (role && user.role !== role) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     req.currentUser = user;
//     next();
//   });
// }

// async function ensureDemoUsers() {
//   const operations = demoUsers.map((user) => ({
//     updateOne: {
//       filter: { phone: user.phone },
//       update: {
//         $set: {
//           ...user,
//           initials: getInitials(user.name)
//         }
//       },
//       upsert: true
//     }
//   }));

//   await User.bulkWrite(operations);
// }

// app.post(
//   '/api/auth/send-otp',
//   asyncHandler(async (req, res) => {
//     const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);

//     if (phone.length !== 10) {
//       return res.status(400).json({ error: 'Invalid phone number' });
//     }

//     await Otp.findOneAndUpdate(
//       { phone },
//       {
//         phone,
//         code: DEMO_OTP,
//         expiresAt: new Date(Date.now() + OTP_EXPIRY_MS)
//       },
//       {
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: true
//       }
//     );

//     console.log(`Demo OTP for ${phone}: ${DEMO_OTP}`);

//     res.json({
//       success: true,
//       otp: DEMO_OTP,
//       message: `OTP sent to ${phone}`
//     });
//   })
// );

// app.post(
//   '/api/auth/verify-otp',
//   asyncHandler(async (req, res) => {
//     const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
//     const otp = String(req.body.otp || '').trim();

//     const record = await Otp.findOne({ phone }).lean();

//     if (!record || record.code !== otp || Date.now() > new Date(record.expiresAt).getTime()) {
//       return res.status(401).json({ error: 'Invalid or expired OTP' });
//     }

//     await Otp.deleteOne({ _id: record._id });

//     const users = await User.find({ phone });
//     if (!users.length) {
//       return res.status(404).json({
//         error: 'User not found. Try 9876543210 for patient or 9123456780 for doctor.'
//       });
//     }

//     res.json({
//       success: true,
//       users: users.map(serializeUser)
//     });
//   })
// );

// app.post(
//   '/api/auth/login',
//   asyncHandler(async (req, res) => {
//     const { userId } = req.body;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     req.session.userId = String(user._id);
//     req.session.role = user.role;

//     res.json({
//       success: true,
//       user: serializeUser(user)
//     });
//   })
// );

// app.post('/api/auth/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.json({ success: true });
//   });
// });

// app.get(
//   '/api/auth/me',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     res.json({ user: serializeUser(req.currentUser) });
//   })
// );

// app.get(
//   '/api/doctors',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const doctors = await User.find({ role: 'doctor' }).sort({ name: 1 });
//     res.json({ doctors: doctors.map(serializeUser) });
//   })
// );

// app.get(
//   '/api/users',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const roleFilter = req.currentUser.role === 'patient' ? 'doctor' : 'patient';
//     const users = await User.find({
//       _id: { $ne: req.currentUser._id },
//       role: roleFilter
//     }).sort({ name: 1 });

//     res.json({
//       users: users.map(serializeUser)
//     });
//   })
// );

// app.get(
//   '/api/conversations',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const currentUserId = String(req.currentUser._id);

//     const [messages, relatedAppointmentUserIds] = await Promise.all([
//       Message.find({
//         $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
//       })
//         .sort({ createdAt: -1 })
//         .lean(),
//       req.currentUser.role === 'patient'
//         ? Appointment.distinct('doctorId', { patientId: req.currentUser._id })
//         : Appointment.distinct('patientId', { doctorId: req.currentUser._id })
//     ]);

//     const lastMessagesByContact = new Map();
//     const unreadCountsByContact = new Map();

//     for (const message of messages) {
//       const otherUserId =
//         String(message.senderId) === currentUserId
//           ? String(message.receiverId)
//           : String(message.senderId);

//       if (!lastMessagesByContact.has(otherUserId)) {
//         lastMessagesByContact.set(otherUserId, message);
//       }

//       if (
//         String(message.receiverId) === currentUserId &&
//         !message.readAt &&
//         String(message.senderId) !== currentUserId
//       ) {
//         unreadCountsByContact.set(
//           otherUserId,
//           (unreadCountsByContact.get(otherUserId) || 0) + 1
//         );
//       }
//     }

//     const contactIds = new Set([
//       ...relatedAppointmentUserIds.map((id) => String(id)),
//       ...lastMessagesByContact.keys()
//     ]);

//     if (!contactIds.size) {
//       return res.json({ conversations: [] });
//     }

//     const contacts = await User.find({
//       _id: { $in: Array.from(contactIds) }
//     });

//     const serializedUsers = new Map(
//       contacts.map((user) => [String(user._id), serializeUser(user)])
//     );

//     const conversations = Array.from(contactIds)
//       .map((contactId) => {
//         const contact = serializedUsers.get(contactId);
//         if (!contact) {
//           return null;
//         }

//         const lastMessage = lastMessagesByContact.get(contactId);

//         return {
//           contact,
//           lastMessage: lastMessage ? serializeMessage(lastMessage) : null,
//           unreadCount: unreadCountsByContact.get(contactId) || 0
//         };
//       })
//       .filter(Boolean)
//       .sort((a, b) => {
//         const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
//         const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;

//         if (aTime !== bTime) {
//           return bTime - aTime;
//         }

//         return a.contact.name.localeCompare(b.contact.name);
//       });

//     res.json({ conversations });
//   })
// );

// app.get(
//   '/api/messages/:userId',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const currentUserId = String(req.currentUser._id);
//     const otherUserId = String(req.params.userId);
//     const otherUser = await User.findById(otherUserId);

//     if (!otherUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const unreadMessages = await Message.find(
//       {
//         senderId: otherUserId,
//         receiverId: currentUserId,
//         readAt: null
//       }
//     )
//       .select('_id')
//       .lean();

//     if (unreadMessages.length) {
//       const readAt = new Date();

//       await Message.updateMany(
//         {
//           _id: { $in: unreadMessages.map((message) => message._id) }
//         },
//         {
//           $set: { readAt }
//         }
//       );

//       emitToUser(otherUserId, 'message-read', {
//         readerId: currentUserId,
//         conversationUserId: currentUserId,
//         messageIds: unreadMessages.map((message) => String(message._id)),
//         readAt
//       });
//     }

//     const messages = await Message.find({
//       $or: [
//         { senderId: currentUserId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: currentUserId }
//       ]
//     })
//       .sort({ createdAt: 1 })
//       .lean();

//     res.json({
//       messages: messages.map(serializeMessage)
//     });
//   })
// );

// app.post(
//   '/api/messages',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const senderId = String(req.currentUser._id);
//     const receiverId = String(req.body.receiverId || '');
//     const content = String(req.body.content || '').trim();

//     if (!receiverId || !content) {
//       return res.status(400).json({ error: 'receiverId and content are required' });
//     }

//     if (receiverId === senderId) {
//       return res.status(400).json({ error: 'Cannot message yourself' });
//     }

//     const receiver = await User.findById(receiverId);
//     if (!receiver) {
//       return res.status(404).json({ error: 'Receiver not found' });
//     }

//     const message = await Message.create({
//       senderId,
//       receiverId,
//       content
//     });

//     const serializedMessage = serializeMessage(message);
//     emitToUser(senderId, 'message-received', serializedMessage);
//     emitToUser(receiverId, 'message-received', serializedMessage);

//     res.json({
//       success: true,
//       message: serializedMessage
//     });
//   })
// );

// app.post(
//   '/api/appointments',
//   requireAuth('patient'),
//   asyncHandler(async (req, res) => {
//     const { doctorId, date, time, type, symptoms } = req.body;

//     if (!doctorId || !date || !time) {
//       return res.status(400).json({ error: 'Doctor, date, and time are required' });
//     }

//     const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
//     if (!doctor) {
//       return res.status(404).json({ error: 'Doctor not found' });
//     }

//     const conflictingAppointment = await Appointment.findOne({
//       doctorId,
//       date,
//       time,
//       status: { $ne: 'cancelled' }
//     });

//     if (conflictingAppointment) {
//       return res.status(409).json({ error: 'This slot is already booked' });
//     }

//     const appointment = await Appointment.create({
//       patientId: req.currentUser._id,
//       doctorId: doctor._id,
//       date,
//       time,
//       type: type || 'Video Consultation',
//       status: 'pending',
//       symptoms: symptoms || '',
//       fee: doctor.fee || 0
//     });

//     const populatedAppointment = await Appointment.findById(appointment._id)
//       .populate('patientId')
//       .populate('doctorId');

//     res.json({
//       success: true,
//       appointment: serializeAppointment(populatedAppointment)
//     });
//   })
// );

// app.get(
//   '/api/appointments',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const filter =
//       req.currentUser.role === 'doctor'
//         ? { doctorId: req.currentUser._id }
//         : { patientId: req.currentUser._id };

//     const appointments = await Appointment.find(filter)
//       .sort({ date: 1, time: 1 })
//       .populate('patientId')
//       .populate('doctorId');

//     res.json({
//       appointments: appointments.map(serializeAppointment)
//     });
//   })
// );

// app.get(
//   '/api/appointments/slots',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const doctorId = String(req.query.doctorId || '').trim();
//     const date = String(req.query.date || '').trim();

//     if (!doctorId || !date) {
//       return res.status(400).json({ error: 'doctorId and date are required' });
//     }

//     const appointments = await Appointment.find({
//       doctorId,
//       date,
//       status: { $ne: 'cancelled' }
//     })
//       .select('time')
//       .lean();

//     res.json({
//       booked: appointments.map((appointment) => appointment.time)
//     });
//   })
// );

// app.put(
//   '/api/appointments/:id/status',
//   requireAuth('doctor'),
//   asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const allowedStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled']);

//     if (!allowedStatuses.has(status)) {
//       return res.status(400).json({ error: 'Invalid appointment status' });
//     }

//     const appointment = await Appointment.findOneAndUpdate(
//       { _id: req.params.id, doctorId: req.currentUser._id },
//       { status },
//       { new: true }
//     )
//       .populate('patientId')
//       .populate('doctorId');

//     if (!appointment) {
//       return res.status(404).json({ error: 'Appointment not found' });
//     }

//     res.json({
//       success: true,
//       appointment: serializeAppointment(appointment)
//     });
//   })
// );

// app.get(
//   '/api/stats',
//   requireAuth(),
//   asyncHandler(async (req, res) => {
//     const today = todayStr();
//     const { start, end } = monthBounds();
//     const unreadMessages = await Message.countDocuments({
//       receiverId: req.currentUser._id,
//       readAt: null
//     });

//     if (req.currentUser.role === 'patient') {
//       const [upcoming, completed] = await Promise.all([
//         Appointment.countDocuments({
//           patientId: req.currentUser._id,
//           status: { $in: ['pending', 'confirmed'] }
//         }),
//         Appointment.countDocuments({
//           patientId: req.currentUser._id,
//           status: 'completed'
//         })
//       ]);

//       return res.json({
//         upcoming,
//         completed,
//         unreadMessages,
//         documents: 0
//       });
//     }

//     const [todayAppointments, completedThisMonth, patientIds, revenueRows] = await Promise.all([
//       Appointment.countDocuments({
//         doctorId: req.currentUser._id,
//         date: today,
//         status: { $ne: 'cancelled' }
//       }),
//       Appointment.countDocuments({
//         doctorId: req.currentUser._id,
//         status: 'completed',
//         date: { $gte: start, $lte: end }
//       }),
//       Appointment.distinct('patientId', { doctorId: req.currentUser._id }),
//       Appointment.find({
//         doctorId: req.currentUser._id,
//         status: { $in: ['confirmed', 'completed'] },
//         date: { $gte: start, $lte: end }
//       })
//         .select('fee')
//         .lean()
//     ]);

//     const revenue = revenueRows.reduce((sum, row) => sum + (row.fee || 0), 0);

//     res.json({
//       todayAppointments,
//       completedThisMonth,
//       totalPatients: patientIds.length,
//       revenue,
//       unreadMessages
//     });
//   })
// );

// io.on('connection', (socket) => {
//   socket.on('user-login', async (userId) => {
//     try {
//       const normalizedUserId = String(userId || '').trim();
//       if (!normalizedUserId) {
//         return;
//       }

//       const userExists = await User.exists({ _id: normalizedUserId });
//       if (!userExists) {
//         return;
//       }

//       const wasOnline = activeUsers.has(normalizedUserId);
//       socket.userId = normalizedUserId;
//       addActiveSocket(normalizedUserId, socket.id);
//       await User.findByIdAndUpdate(normalizedUserId, { lastSeenAt: new Date() });

//       if (!wasOnline) {
//         broadcastUserStatus(normalizedUserId, true);
//       }
//     } catch (error) {
//       console.error('Socket login error:', error);
//     }
//   });

//   socket.on('typing', ({ receiverId }) => {
//     if (!socket.userId || !receiverId) {
//       return;
//     }

//     emitToUser(String(receiverId), 'user-typing', {
//       senderId: socket.userId,
//       typing: true
//     });
//   });

//   socket.on('stop-typing', ({ receiverId }) => {
//     if (!socket.userId || !receiverId) {
//       return;
//     }

//     emitToUser(String(receiverId), 'user-typing', {
//       senderId: socket.userId,
//       typing: false
//     });
//   });

//   socket.on('send-message', async ({ receiverId, content }) => {
//     try {
//       if (!socket.userId) {
//         return;
//       }

//       const trimmedContent = String(content || '').trim();
//       const normalizedReceiverId = String(receiverId || '').trim();

//       if (!trimmedContent || !normalizedReceiverId || normalizedReceiverId === socket.userId) {
//         return;
//       }

//       const receiver = await User.findById(normalizedReceiverId);
//       if (!receiver) {
//         return;
//       }

//       const message = await Message.create({
//         senderId: socket.userId,
//         receiverId: normalizedReceiverId,
//         content: trimmedContent
//       });

//       const serializedMessage = serializeMessage(message);

//       emitToUser(socket.userId, 'message-received', serializedMessage);
//       emitToUser(normalizedReceiverId, 'message-received', serializedMessage);
//       emitToUser(normalizedReceiverId, 'user-typing', {
//         senderId: socket.userId,
//         typing: false
//       });
//     } catch (error) {
//       console.error('Socket message error:', error);
//       socket.emit('chat-error', { error: 'Failed to send message' });
//     }
//   });

//   socket.on('disconnect', async () => {
//     const becameOffline = removeActiveSocket(socket.userId, socket.id);

//     if (becameOffline && socket.userId) {
//       const lastSeenAt = new Date();
//       await User.findByIdAndUpdate(socket.userId, { lastSeenAt });
//       broadcastUserStatus(socket.userId, false, lastSeenAt);
//     }
//   });
// });

// Object.entries(pageRoutes).forEach(([route, fileName]) => {
//   app.get(route, (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', fileName));
//   });
// });

// app.use((req, res) => {
//   if (req.path.startsWith('/api/')) {
//     return res.status(404).json({ error: 'Route not found' });
//   }

//   res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.use((error, req, res, next) => {
//   if (res.headersSent) {
//     return next(error);
//   }

//   console.error(error);
//   res.status(500).json({
//     error: error.message || 'Internal server error'
//   });
// });

// function listenOnAvailablePort(startPort, retries = 10) {
//   return new Promise((resolve, reject) => {
//     const tryListen = (port, attemptsLeft) => {
//       const onError = (error) => {
//         server.off('listening', onListening);

//         if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
//           console.warn(`Port ${port} is busy, trying ${port + 1}...`);
//           tryListen(port + 1, attemptsLeft - 1);
//           return;
//         }

//         reject(error);
//       };

//       const onListening = () => {
//         server.off('error', onError);
//         resolve(port);
//       };

//       server.once('error', onError);
//       server.once('listening', onListening);
//       server.listen(port);
//     };

//     tryListen(startPort, retries);
//   });
// }

// async function connectToMongo() {
//   const candidates = [
//     { uri: MONGO_URI, label: 'primary' }
//   ];

//   if (MONGO_FALLBACK_URI && MONGO_FALLBACK_URI !== MONGO_URI) {
//     candidates.push({ uri: MONGO_FALLBACK_URI, label: 'fallback' });
//   }

//   let lastError = null;

//   for (const candidate of candidates) {
//     try {
//       await mongoose.connect(candidate.uri, {
//         dbName: MONGO_DB_NAME,
//         serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS
//       });

//       return candidate;
//     } catch (error) {
//       lastError = error;
//       await mongoose.disconnect().catch(() => {});

//       const prefix =
//         candidate.label === 'primary'
//           ? 'Primary MongoDB connection failed'
//           : 'Fallback MongoDB connection failed';

//       console.warn(`${prefix}: ${error.message}`);
//     }
//   }

//   throw lastError;
// }

// async function start() {
//   const mongoConnection = await connectToMongo();
//   await ensureDemoUsers();

//   const activePort = await listenOnAvailablePort(PORT);
//   console.log(`MedConnect server running at http://localhost:${activePort}`);
//   console.log(`MongoDB database: ${mongoose.connection.name}`);
//   console.log(`MongoDB source: ${mongoConnection.label}`);
//   console.log('Demo credentials: patient 9876543210 / doctor 9123456780 / OTP 1234');
// }

// start().catch((error) => {
//   console.error('Failed to start server:', error);
//   process.exit(1);
// });
require('dotenv').config();

const express = require('express');
const http = require('http');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');

const User = require('./models/user');
const Appointment = require('./models/Appointment');
const Message = require('./models/Message');
const Otp = require('./models/Otp');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'Medconnect';
const MONGO_FALLBACK_URI =
  process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017';
const MONGO_CONNECT_TIMEOUT_MS =
  Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 5000;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const TYPING_AUTO_EXPIRE_MS = 4000;
const DEMO_OTP = '1234';
const activeUsers = new Map();
// Map<"senderId:receiverId", NodeJS.Timeout> for server-side typing auto-expire
const typingTimers = new Map();

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in environment');
}

const demoUsers = [
  { name: 'Amit Kumar', phone: '9876543210', role: 'patient', email: 'amit.kumar@email.com', age: 28, gender: 'Male' },
  { name: 'Dr. Rahul Sharma', phone: '9123456780', role: 'doctor', specialization: 'General Physician', experience: '10 years', fee: 500, rating: 4.9, reviews: 120 },
  { name: 'Dr. Divya Nair', phone: '9000000001', role: 'doctor', specialization: 'Dermatologist', experience: '7 years', fee: 600, rating: 4.8, reviews: 85 },
  { name: 'Dr. Amit Patel', phone: '9000000002', role: 'doctor', specialization: 'Cardiologist', experience: '15 years', fee: 800, rating: 4.9, reviews: 200 },
  { name: 'Dr. Suresh Kumar', phone: '9000000003', role: 'doctor', specialization: 'Nutritionist', experience: '5 years', fee: 400, rating: 4.7, reviews: 60 },
  { name: 'Sunita Patel', phone: '9111111111', role: 'patient', email: 'sunita@email.com', age: 35, gender: 'Female' },
  { name: 'Rajesh Jain', phone: '9222222222', role: 'patient', email: 'rajesh@email.com', age: 45, gender: 'Male' }
];

const pageRoutes = {
  '/': 'index.html',
  '/patient-dashboard': 'patient-dashboard.html',
  '/doctor-dashboard': 'doctor-dashboard.html',
  '/appointment': 'appointment.html',
  '/chat': 'chat.html',
  '/payment': 'payment.html',
  '/prescription': 'prescription.html',
  '/documents': 'documents.html'
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'medconnect-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function getInitials(name = '') {
  return name.split(/\s+/).filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function monthBounds() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));
  return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
}

function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function serializeUser(userDoc, options = {}) {
  if (!userDoc) return null;
  const user = typeof userDoc.toObject === 'function' ? userDoc.toObject() : { ...userDoc };
  const userId = String(user._id || user.id);
  return {
    id: userId,
    name: user.name,
    phone: user.phone,
    role: user.role,
    initials: user.initials || getInitials(user.name),
    email: user.email || '',
    age: user.age ?? null,
    gender: user.gender || '',
    specialization: user.specialization || '',
    experience: user.experience || '',
    fee: user.fee ?? 0,
    rating: user.rating ?? 0,
    reviews: user.reviews ?? 0,
    isOnline: options.isOnline ?? activeUsers.has(userId),
    lastSeenAt: user.lastSeenAt || null
  };
}

function serializeAppointment(appointmentDoc) {
  const appointment = typeof appointmentDoc.toObject === 'function' ? appointmentDoc.toObject() : { ...appointmentDoc };
  const populatedPatient = appointment.patientId && typeof appointment.patientId === 'object' ? serializeUser(appointment.patientId) : null;
  const populatedDoctor = appointment.doctorId && typeof appointment.doctorId === 'object' ? serializeUser(appointment.doctorId) : null;
  return {
    id: String(appointment._id || appointment.id),
    patientId: populatedPatient ? populatedPatient.id : String(appointment.patientId),
    doctorId: populatedDoctor ? populatedDoctor.id : String(appointment.doctorId),
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    status: appointment.status,
    symptoms: appointment.symptoms || '',
    fee: appointment.fee ?? 0,
    patient: populatedPatient,
    doctor: populatedDoctor,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt
  };
}

function serializeMessage(messageDoc) {
  const message = typeof messageDoc.toObject === 'function' ? messageDoc.toObject() : { ...messageDoc };
  const status = message.readAt ? 'seen' : message.deliveredAt ? 'delivered' : 'sent';
  return {
    id: String(message._id || message.id),
    clientId: message.clientId || null,
    senderId: message.senderId && typeof message.senderId === 'object' ? String(message.senderId._id) : String(message.senderId),
    receiverId: message.receiverId && typeof message.receiverId === 'object' ? String(message.receiverId._id) : String(message.receiverId),
    content: message.content,
    timestamp: formatTime(message.createdAt || new Date()),
    createdAt: message.createdAt,
    deliveredAt: message.deliveredAt || null,
    readAt: message.readAt || null,
    status
  };
}

function addActiveSocket(userId, socketId) {
  const existing = activeUsers.get(userId) || new Set();
  existing.add(socketId);
  activeUsers.set(userId, existing);
}

function removeActiveSocket(userId, socketId) {
  if (!userId || !activeUsers.has(userId)) return false;
  const sockets = activeUsers.get(userId);
  sockets.delete(socketId);
  if (sockets.size === 0) {
    activeUsers.delete(userId);
    return true;
  }
  return false;
}

function emitToUser(userId, eventName, payload) {
  const sockets = activeUsers.get(String(userId));
  if (!sockets) return;
  for (const socketId of sockets) io.to(socketId).emit(eventName, payload);
}

function broadcastUserStatus(userId, isOnline, lastSeenAt = null) {
  io.emit('user-status', { userId: String(userId), isOnline, lastSeenAt });
}

function clearTypingTimer(key) {
  const t = typingTimers.get(key);
  if (t) {
    clearTimeout(t);
    typingTimers.delete(key);
  }
}

function requireAuth(role) {
  return asyncHandler(async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Session expired' });
    }
    if (role && user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    req.currentUser = user;
    next();
  });
}

async function ensureDemoUsers() {
  const operations = demoUsers.map((user) => ({
    updateOne: {
      filter: { phone: user.phone },
      update: { $set: { ...user, initials: getInitials(user.name) } },
      upsert: true
    }
  }));
  await User.bulkWrite(operations);
}

/* ───────── Auth ───────── */

app.post('/api/auth/send-otp', asyncHandler(async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
  if (phone.length !== 10) return res.status(400).json({ error: 'Invalid phone number' });
  await Otp.findOneAndUpdate(
    { phone },
    { phone, code: DEMO_OTP, expiresAt: new Date(Date.now() + OTP_EXPIRY_MS) },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Demo OTP for ${phone}: ${DEMO_OTP}`);
  res.json({ success: true, otp: DEMO_OTP, message: `OTP sent to ${phone}` });
}));

app.post('/api/auth/verify-otp', asyncHandler(async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '').slice(-10);
  const otp = String(req.body.otp || '').trim();
  const record = await Otp.findOne({ phone }).lean();
  if (!record || record.code !== otp || Date.now() > new Date(record.expiresAt).getTime()) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  await Otp.deleteOne({ _id: record._id });
  const users = await User.find({ phone });
  if (!users.length) {
    return res.status(404).json({ error: 'User not found. Try 9876543210 for patient or 9123456780 for doctor.' });
  }
  res.json({ success: true, users: users.map(serializeUser) });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  req.session.userId = String(user._id);
  req.session.role = user.role;
  res.json({ success: true, user: serializeUser(user) });
}));

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/auth/me', requireAuth(), asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.currentUser) });
}));

/* ───────── Users / Doctors / Conversations ───────── */

app.get('/api/doctors', requireAuth(), asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).sort({ name: 1 });
  res.json({ doctors: doctors.map(serializeUser) });
}));

app.get('/api/users', requireAuth(), asyncHandler(async (req, res) => {
  const roleFilter = req.currentUser.role === 'patient' ? 'doctor' : 'patient';
  const users = await User.find({ _id: { $ne: req.currentUser._id }, role: roleFilter }).sort({ name: 1 });
  res.json({ users: users.map(serializeUser) });
}));

app.get('/api/conversations', requireAuth(), asyncHandler(async (req, res) => {
  const currentUserId = String(req.currentUser._id);
  const [messages, relatedAppointmentUserIds] = await Promise.all([
    Message.find({ $or: [{ senderId: currentUserId }, { receiverId: currentUserId }] }).sort({ createdAt: -1 }).lean(),
    req.currentUser.role === 'patient'
      ? Appointment.distinct('doctorId', { patientId: req.currentUser._id })
      : Appointment.distinct('patientId', { doctorId: req.currentUser._id })
  ]);

  const lastMessagesByContact = new Map();
  const unreadCountsByContact = new Map();
  for (const message of messages) {
    const otherUserId = String(message.senderId) === currentUserId ? String(message.receiverId) : String(message.senderId);
    if (!lastMessagesByContact.has(otherUserId)) lastMessagesByContact.set(otherUserId, message);
    if (String(message.receiverId) === currentUserId && !message.readAt && String(message.senderId) !== currentUserId) {
      unreadCountsByContact.set(otherUserId, (unreadCountsByContact.get(otherUserId) || 0) + 1);
    }
  }

  const contactIds = new Set([...relatedAppointmentUserIds.map((id) => String(id)), ...lastMessagesByContact.keys()]);
  if (!contactIds.size) return res.json({ conversations: [] });

  const contacts = await User.find({ _id: { $in: Array.from(contactIds) } });
  const serializedUsers = new Map(contacts.map((u) => [String(u._id), serializeUser(u)]));

  const conversations = Array.from(contactIds)
    .map((contactId) => {
      const contact = serializedUsers.get(contactId);
      if (!contact) return null;
      const lastMessage = lastMessagesByContact.get(contactId);
      return {
        contact,
        lastMessage: lastMessage ? serializeMessage(lastMessage) : null,
        unreadCount: unreadCountsByContact.get(contactId) || 0
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aT = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bT = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      if (aT !== bT) return bT - aT;
      return a.contact.name.localeCompare(b.contact.name);
    });

  res.json({ conversations });
}));

/* ───────── Messages (REST) ───────── */

app.get('/api/messages/:userId', requireAuth(), asyncHandler(async (req, res) => {
  const currentUserId = String(req.currentUser._id);
  const otherUserId = String(req.params.userId);
  const otherUser = await User.findById(otherUserId);
  if (!otherUser) return res.status(404).json({ error: 'User not found' });

  // Mark previously-undelivered inbound messages as delivered (recipient just fetched them)
  const undelivered = await Message.find({
    senderId: otherUserId,
    receiverId: currentUserId,
    deliveredAt: null
  }).select('_id').lean();

  if (undelivered.length) {
    const deliveredAt = new Date();
    await Message.updateMany(
      { _id: { $in: undelivered.map((m) => m._id) } },
      { $set: { deliveredAt } }
    );
    emitToUser(otherUserId, 'message-delivered', {
      receiverId: currentUserId,
      messageIds: undelivered.map((m) => String(m._id)),
      deliveredAt
    });
  }

  // Mark unread → read
  const unreadMessages = await Message.find({
    senderId: otherUserId,
    receiverId: currentUserId,
    readAt: null
  }).select('_id').lean();

  if (unreadMessages.length) {
    const readAt = new Date();
    await Message.updateMany(
      { _id: { $in: unreadMessages.map((m) => m._id) } },
      { $set: { readAt } }
    );
    emitToUser(otherUserId, 'message-read', {
      readerId: currentUserId,
      conversationUserId: currentUserId,
      messageIds: unreadMessages.map((m) => String(m._id)),
      readAt
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId }
    ]
  }).sort({ createdAt: 1 }).lean();

  res.json({ messages: messages.map(serializeMessage) });
}));

app.post('/api/messages', requireAuth(), asyncHandler(async (req, res) => {
  const senderId = String(req.currentUser._id);
  const receiverId = String(req.body.receiverId || '');
  const content = String(req.body.content || '').trim();
  const clientId = req.body.clientId ? String(req.body.clientId) : null;

  if (!receiverId || !content) return res.status(400).json({ error: 'receiverId and content are required' });
  if (receiverId === senderId) return res.status(400).json({ error: 'Cannot message yourself' });

  const receiver = await User.findById(receiverId);
  if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

  // Idempotency: if a message with this clientId from this sender exists, return it.
  if (clientId) {
    const existing = await Message.findOne({ senderId, clientId });
    if (existing) {
      return res.json({ success: true, message: serializeMessage(existing), duplicate: true });
    }
  }

  let message;
  try {
    message = await Message.create({ senderId, receiverId, content, clientId });
  } catch (err) {
    // Race on unique index — fetch the winning doc.
    if (err && err.code === 11000 && clientId) {
      message = await Message.findOne({ senderId, clientId });
    } else {
      throw err;
    }
  }

  // If recipient is online, mark delivered now.
  if (activeUsers.has(receiverId) && !message.deliveredAt) {
    message.deliveredAt = new Date();
    await message.save();
  }

  const serializedMessage = serializeMessage(message);
  emitToUser(senderId, 'message-saved', serializedMessage);
  emitToUser(senderId, 'message-received', serializedMessage);
  emitToUser(receiverId, 'message-received', serializedMessage);

  if (message.deliveredAt) {
    emitToUser(senderId, 'message-delivered', {
      receiverId,
      messageIds: [String(message._id)],
      deliveredAt: message.deliveredAt
    });
  }

  res.json({ success: true, message: serializedMessage });
}));

/* ───────── Appointments ───────── */

app.post('/api/appointments', requireAuth('patient'), asyncHandler(async (req, res) => {
  const { doctorId, date, time, type, symptoms } = req.body;
  if (!doctorId || !date || !time) return res.status(400).json({ error: 'Doctor, date, and time are required' });
  const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  const conflict = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'cancelled' } });
  if (conflict) return res.status(409).json({ error: 'This slot is already booked' });

  const appointment = await Appointment.create({
    patientId: req.currentUser._id,
    doctorId: doctor._id,
    date, time,
    type: type || 'Video Consultation',
    status: 'pending',
    symptoms: symptoms || '',
    fee: doctor.fee || 0
  });

  const populated = await Appointment.findById(appointment._id).populate('patientId').populate('doctorId');
  res.json({ success: true, appointment: serializeAppointment(populated) });
}));

app.get('/api/appointments', requireAuth(), asyncHandler(async (req, res) => {
  const filter = req.currentUser.role === 'doctor' ? { doctorId: req.currentUser._id } : { patientId: req.currentUser._id };
  const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 }).populate('patientId').populate('doctorId');
  res.json({ appointments: appointments.map(serializeAppointment) });
}));

app.get('/api/appointments/slots', requireAuth(), asyncHandler(async (req, res) => {
  const doctorId = String(req.query.doctorId || '').trim();
  const date = String(req.query.date || '').trim();
  if (!doctorId || !date) return res.status(400).json({ error: 'doctorId and date are required' });
  const appointments = await Appointment.find({ doctorId, date, status: { $ne: 'cancelled' } }).select('time').lean();
  res.json({ booked: appointments.map((a) => a.time) });
}));

app.put('/api/appointments/:id/status', requireAuth('doctor'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = new Set(['pending', 'confirmed', 'completed', 'cancelled']);
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid appointment status' });
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, doctorId: req.currentUser._id },
    { status },
    { new: true }
  ).populate('patientId').populate('doctorId');
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  res.json({ success: true, appointment: serializeAppointment(appointment) });
}));

/* ───────── Stats ───────── */

app.get('/api/stats', requireAuth(), asyncHandler(async (req, res) => {
  const today = todayStr();
  const { start, end } = monthBounds();
  const unreadMessages = await Message.countDocuments({ receiverId: req.currentUser._id, readAt: null });

  if (req.currentUser.role === 'patient') {
    const [upcoming, completed] = await Promise.all([
      Appointment.countDocuments({ patientId: req.currentUser._id, status: { $in: ['pending', 'confirmed'] } }),
      Appointment.countDocuments({ patientId: req.currentUser._id, status: 'completed' })
    ]);
    return res.json({ upcoming, completed, unreadMessages, documents: 0 });
  }

  const [todayAppointments, completedThisMonth, patientIds, revenueRows] = await Promise.all([
    Appointment.countDocuments({ doctorId: req.currentUser._id, date: today, status: { $ne: 'cancelled' } }),
    Appointment.countDocuments({ doctorId: req.currentUser._id, status: 'completed', date: { $gte: start, $lte: end } }),
    Appointment.distinct('patientId', { doctorId: req.currentUser._id }),
    Appointment.find({ doctorId: req.currentUser._id, status: { $in: ['confirmed', 'completed'] }, date: { $gte: start, $lte: end } }).select('fee').lean()
  ]);

  const revenue = revenueRows.reduce((sum, row) => sum + (row.fee || 0), 0);
  res.json({ todayAppointments, completedThisMonth, totalPatients: patientIds.length, revenue, unreadMessages });
}));

/* ───────── Socket.IO ───────── */

io.on('connection', (socket) => {
  socket.on('user-login', async (userId) => {
    try {
      const normalizedUserId = String(userId || '').trim();
      if (!normalizedUserId) return;
      const userExists = await User.exists({ _id: normalizedUserId });
      if (!userExists) return;

      const wasOnline = activeUsers.has(normalizedUserId);
      socket.userId = normalizedUserId;
      addActiveSocket(normalizedUserId, socket.id);
      await User.findByIdAndUpdate(normalizedUserId, { lastSeenAt: new Date() });
      if (!wasOnline) broadcastUserStatus(normalizedUserId, true);
    } catch (error) {
      console.error('Socket login error:', error);
    }
  });

  socket.on('typing', ({ receiverId } = {}) => {
    if (!socket.userId || !receiverId) return;
    const key = `${socket.userId}:${String(receiverId)}`;
    clearTypingTimer(key);
    emitToUser(String(receiverId), 'user-typing', { senderId: socket.userId, typing: true });
    typingTimers.set(
      key,
      setTimeout(() => {
        emitToUser(String(receiverId), 'user-typing', { senderId: socket.userId, typing: false });
        typingTimers.delete(key);
      }, TYPING_AUTO_EXPIRE_MS)
    );
  });

  socket.on('stop-typing', ({ receiverId } = {}) => {
    if (!socket.userId || !receiverId) return;
    const key = `${socket.userId}:${String(receiverId)}`;
    clearTypingTimer(key);
    emitToUser(String(receiverId), 'user-typing', { senderId: socket.userId, typing: false });
  });

  socket.on('send-message', async ({ receiverId, content, clientId } = {}) => {
    const normalizedClientId = clientId ? String(clientId) : null;
    try {
      if (!socket.userId) {
        return socket.emit('chat-error', { clientId: normalizedClientId, error: 'Not authenticated' });
      }

      const trimmedContent = String(content || '').trim();
      const normalizedReceiverId = String(receiverId || '').trim();

      if (!trimmedContent || !normalizedReceiverId || normalizedReceiverId === socket.userId) {
        return socket.emit('chat-error', { clientId: normalizedClientId, error: 'Invalid message' });
      }

      const receiver = await User.findById(normalizedReceiverId);
      if (!receiver) {
        return socket.emit('chat-error', { clientId: normalizedClientId, error: 'Receiver not found' });
      }

      // Idempotent insert keyed on (senderId, clientId)
      let message = null;
      if (normalizedClientId) {
        message = await Message.findOne({ senderId: socket.userId, clientId: normalizedClientId });
      }

      if (!message) {
        try {
          message = await Message.create({
            senderId: socket.userId,
            receiverId: normalizedReceiverId,
            content: trimmedContent,
            clientId: normalizedClientId
          });
        } catch (err) {
          if (err && err.code === 11000 && normalizedClientId) {
            message = await Message.findOne({ senderId: socket.userId, clientId: normalizedClientId });
          } else {
            throw err;
          }
        }
      }

      // If recipient is online, persist deliveredAt before broadcasting.
      if (activeUsers.has(normalizedReceiverId) && !message.deliveredAt) {
        message.deliveredAt = new Date();
        await message.save();
      }

      const serializedMessage = serializeMessage(message);

      // Ack sender first so optimistic UI can reconcile.
      socket.emit('message-saved', serializedMessage);
      emitToUser(socket.userId, 'message-received', serializedMessage);
      emitToUser(normalizedReceiverId, 'message-received', serializedMessage);

      if (message.deliveredAt) {
        emitToUser(socket.userId, 'message-delivered', {
          receiverId: normalizedReceiverId,
          messageIds: [String(message._id)],
          deliveredAt: message.deliveredAt
        });
      }

      // Clear any typing indicator from sender → receiver.
      const tKey = `${socket.userId}:${normalizedReceiverId}`;
      clearTypingTimer(tKey);
      emitToUser(normalizedReceiverId, 'user-typing', { senderId: socket.userId, typing: false });
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('chat-error', { clientId: normalizedClientId, error: 'Failed to send message' });
    }
  });

  // Receiver tells server "I've read these messages from senderId"
  socket.on('mark-read', async ({ senderId } = {}) => {
    try {
      if (!socket.userId || !senderId) return;
      const otherId = String(senderId);

      const unread = await Message.find({
        senderId: otherId,
        receiverId: socket.userId,
        readAt: null
      }).select('_id').lean();

      if (!unread.length) return;

      const readAt = new Date();
      await Message.updateMany(
        { _id: { $in: unread.map((m) => m._id) } },
        { $set: { readAt, deliveredAt: { $ifNull: ['$deliveredAt', readAt] } } }
      ).catch(async () => {
        // Fallback: $ifNull in updateMany isn't supported in older MongoDB; do two passes.
        await Message.updateMany(
          { _id: { $in: unread.map((m) => m._id) }, deliveredAt: null },
          { $set: { deliveredAt: readAt } }
        );
        await Message.updateMany(
          { _id: { $in: unread.map((m) => m._id) } },
          { $set: { readAt } }
        );
      });

      emitToUser(otherId, 'message-read', {
        readerId: socket.userId,
        conversationUserId: socket.userId,
        messageIds: unread.map((m) => String(m._id)),
        readAt
      });
    } catch (error) {
      console.error('mark-read error:', error);
    }
  });

  // Reconnect backfill: client sends last known createdAt; server returns everything newer.
  socket.on('sync-since', async ({ since } = {}, ack) => {
    try {
      if (!socket.userId) return ack && ack({ messages: [] });
      const sinceDate = since ? new Date(since) : new Date(0);
      const messages = await Message.find({
        $or: [{ senderId: socket.userId }, { receiverId: socket.userId }],
        createdAt: { $gt: sinceDate }
      }).sort({ createdAt: 1 }).lean();
      ack && ack({ messages: messages.map(serializeMessage) });
    } catch (error) {
      console.error('sync-since error:', error);
      ack && ack({ messages: [], error: 'sync failed' });
    }
  });

  socket.on('disconnect', async () => {
    // Clear any typing timers owned by this user.
    if (socket.userId) {
      for (const key of Array.from(typingTimers.keys())) {
        if (key.startsWith(`${socket.userId}:`)) clearTypingTimer(key);
      }
    }

    const becameOffline = removeActiveSocket(socket.userId, socket.id);
    if (becameOffline && socket.userId) {
      const lastSeenAt = new Date();
      await User.findByIdAndUpdate(socket.userId, { lastSeenAt });
      broadcastUserStatus(socket.userId, false, lastSeenAt);
    }
  });
});

/* ───────── Pages & error handling ───────── */

Object.entries(pageRoutes).forEach(([route, fileName]) => {
  app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'public', fileName)));
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Route not found' });
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

function listenOnAvailablePort(startPort, retries = 10) {
  return new Promise((resolve, reject) => {
    const tryListen = (port, attemptsLeft) => {
      const onError = (error) => {
        server.off('listening', onListening);
        if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
          console.warn(`Port ${port} is busy, trying ${port + 1}...`);
          tryListen(port + 1, attemptsLeft - 1);
          return;
        }
        reject(error);
      };
      const onListening = () => {
        server.off('error', onError);
        resolve(port);
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    };
    tryListen(startPort, retries);
  });
}

async function connectToMongo() {
  const candidates = [{ uri: MONGO_URI, label: 'primary' }];
  if (MONGO_FALLBACK_URI && MONGO_FALLBACK_URI !== MONGO_URI) {
    candidates.push({ uri: MONGO_FALLBACK_URI, label: 'fallback' });
  }
  let lastError = null;
  for (const candidate of candidates) {
    try {
      await mongoose.connect(candidate.uri, {
        dbName: MONGO_DB_NAME,
        serverSelectionTimeoutMS: MONGO_CONNECT_TIMEOUT_MS
      });
      return candidate;
    } catch (error) {
      lastError = error;
      await mongoose.disconnect().catch(() => {});
      const prefix = candidate.label === 'primary' ? 'Primary MongoDB connection failed' : 'Fallback MongoDB connection failed';
      console.warn(`${prefix}: ${error.message}`);
    }
  }
  throw lastError;
}

async function start() {
  const mongoConnection = await connectToMongo();
  await ensureDemoUsers();
  const activePort = await listenOnAvailablePort(PORT);
  console.log(`MedConnect server running at http://localhost:${activePort}`);
  console.log(`MongoDB database: ${mongoose.connection.name}`);
  console.log(`MongoDB source: ${mongoConnection.label}`);
  console.log('Demo credentials: patient 9876543210 / doctor 9123456780 / OTP 1234');
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
