import { NextRequest, NextResponse } from 'next/server'
import { createMonitorAdminClient } from '@/lib/supabase/admin'
import { getSessionById, updateSessionHeadshot } from '@/lib/monitor/session'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File | null
    const sessionId = formData.get('sessionId') as string | null

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Verify session exists
    const session = await getSessionById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Upload to Supabase Storage
    const supabase = createMonitorAdminClient()
    const fileExt = imageFile.name.split('.').pop() || 'jpg'
    const fileName = `headshots/${sessionId}/original.${fileExt}`

    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('monitor-assets')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('monitor-assets')
      .getPublicUrl(fileName)

    const headshotUrl = urlData.publicUrl

    // Update session with headshot URL
    await updateSessionHeadshot(sessionId, headshotUrl, headshotUrl)

    return NextResponse.json({
      success: true,
      headshotUrl,
    })
  } catch (error) {
    console.error('Headshot upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to upload headshot: ${errorMessage}` },
      { status: 500 }
    )
  }
}
