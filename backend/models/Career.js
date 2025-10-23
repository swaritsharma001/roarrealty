import mongoose from "mongoose"
import slugify from 'slugify'

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
      default: 'Full-time',
    },
    // keep human readable salary, and optional numeric range for filtering
    salary: { type: String, trim: true, default: '' },
    salaryMin: { type: Number, min: 0, default: null },
    salaryMax: { type: Number, min: 0, default: null },

    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, trim: true }], // array of strings
    responsibilities: [{ type: String, trim: true }],

    postedDate: { type: Date, default: Date.now },
    // optional fields for application
    applyUrl: { type: String, trim: true, default: '' },
    contactEmail: { type: String, trim: true, lowercase: true, default: '' },

    experience: { type: String, trim: true, default: '' }, // e.g. "3+ years"
    benefits: [{ type: String, trim: true }],
    remote: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    slug: { type: String, index: true, unique: true, sparse: true },
    // any extra meta
    meta: {
      views: { type: Number, default: 0 },
      applicantsCount: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
  }
);

// Text index for quick search
JobSchema.index({ title: 'text', description: 'text', requirements: 'text', responsibilities: 'text' });

// Create slug before save if not provided
JobSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    const base = slugify(this.title, { lower: true, strict: true });
    // append short id to reduce collision chance
    this.slug = `${base}-${this._id ? this._id.toString().slice(-6) : Date.now().toString().slice(-6)}`;
  }
  next();
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job