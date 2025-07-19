import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

// GET /api/contacts - Get all contacts with optional search, filter, and sort
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const group = searchParams.get('group') || '';
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';

    // Build query
    let query = {};

    // Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by group
    if (group && group !== 'all') {
      query.group = group;
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    sortObj[sort] = sortOrder;

    const contacts = await Contact.find(query)
      .sort(sortObj)
      .lean();

    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length
    });

  } catch (error) {
    console.error('GET /api/contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contacts',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, phone, group } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and email are required'
        },
        { status: 400 }
      );
    }

    // Create new contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      group: group || 'Other'
    });

    const savedContact = await contact.save();

    return NextResponse.json({
      success: true,
      data: savedContact,
      message: 'Contact created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/contacts error:', error);

    // Handle duplicate email error
    if (error.code === 11000 || error.message.includes('Email already exists')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists'
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create contact',
        details: error.message
      },
      { status: 500 }
    );
  }
}