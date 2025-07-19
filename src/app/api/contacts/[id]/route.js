import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';
import mongoose from 'mongoose';

// GET /api/contacts/[id] - Get a single contact
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contact ID'
        },
        { status: 400 }
      );
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('GET /api/contacts/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Update a contact
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contact ID'
        },
        { status: 400 }
      );
    }

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

    // Check if contact exists
    const existingContact = await Contact.findById(id);
    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact not found'
        },
        { status: 404 }
      );
    }

    // Update contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        group: group || 'Other'
      },
      {
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    });

  } catch (error) {
    console.error('PUT /api/contacts/[id] error:', error);

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
        error: 'Failed to update contact',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contact ID'
        },
        { status: 400 }
      );
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedContact,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete contact',
        details: error.message
      },
      { status: 500 }
    );
  }
}