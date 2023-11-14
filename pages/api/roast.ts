import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources/index.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Assuming you're receiving JSON data
    const images: string[] = req.body.images;

    if (!images || images.length === 0) {
      res.status(400).json({ message: "No images provided" });
      return;
    }

    const openai = new OpenAI();

    const imageMessages: ChatCompletionContentPart[] = images.map(
      (base64Image) => ({
        type: "image_url",
        image_url: {
          url: base64Image,
        },
      })
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      stream: false,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Concoct a rib-tickling appraisal of an individual's ensemble and aura in their dating profile snapshot. Delve beyond mere sartorial selections to the stance they've struck, the ambiance they're basking in, and the cohort or objects they've enlisted as accessories. Marinate the narrative in a savory roast comedy marinade, seasoned with zesty quips and a dollop of drollery. Celebrate the style misadventures with a nod to their audacious flair, whether they're surfing the edge of avant-garde or charmingly clashing. Satirize the gym buffs, globe-trotters, and gastronomy aficionados with whimsical analogies that elevate mundane profile props to comedic fame. In crowd shots, weave in a playful 'whodunnit' jest, spotlighting the amusing quest to pinpoint the profile's protagonist. Elevate the prose with metaphors and similes that paint the scene as if it's a sprightly episode of a fashion critique comedy skit. The roast should emit warmth and merriment, crafting a convivial jeer that tickles the funny bone with tender affection, steering clear of the lane of offense. All while speaking plainly, as if to a friend. IMPORTANT: Make sure your response is less than 60 words`,
            },
            ...imageMessages,
          ],
        },
      ],
      max_tokens: 300,
    });

    const aiMessage = response.choices[0].message.content;
    console.log("AI Message:", aiMessage);

    if (!aiMessage) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log("Generating audio...");
    const roastMP3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: aiMessage,
      response_format: "mp3",
    });

    console.log("Finished generating audio");

    // Get the buffer from the response and send it
    const roastMP3Buffer = Buffer.from(await roastMP3.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'attachment; filename="roast.mp3"');
    res.status(200).send(roastMP3Buffer);
  } catch (error) {
    console.error("Error in generating audio:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
