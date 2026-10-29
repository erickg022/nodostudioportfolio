# SUPER PROMPT: Auto-Edit Reels & TikToks with Claude Code or Codex
# SUPER PROMPT: Edición automática de Reels y TikToks con Claude Code o Codex

Turn a folder of raw, unedited clips into a finished vertical video: clips joined in order, silences removed, captions added, and motion graphics that follow what is actually being said. All in one session, any topic, any language.

Convierte una carpeta de clips sin editar en un video vertical terminado: clips unidos en orden, silencios eliminados, subtítulos y gráficos en movimiento según lo que se dice. Todo en una sola sesión, cualquier tema, cualquier idioma.

---

## HOW TO USE / CÓMO USARLO

1. **Create a folder** and put your raw clips inside, named so they sort in chronological order:
   `01_intro.mp4`, `02_main.mp4`, `03_outro.mp4` (or `clip_001.mov`, `clip_002.mov`...).
   *Crea una carpeta y mete tus clips con nombres que se ordenen cronológicamente.*
2. *(Optional)* Add a `music/` subfolder with a track, and a `brand/` subfolder with your logo or font.
   *(Opcional) Añade `music/` con una canción y `brand/` con tu logo o tipografía.*
3. **Open Claude Code or Codex inside that folder.**
   *Abre Claude Code o Codex dentro de esa carpeta.*
4. **Fill in the optional settings** below (or leave them empty to use the defaults).
   *Rellena los ajustes opcionales (o déjalos vacíos para usar los valores por defecto).*
5. **Paste everything from "START OF PROMPT" to "END OF PROMPT"** and let it run.
   *Pega todo lo que hay entre "START OF PROMPT" y "END OF PROMPT" y déjalo trabajar.*

Needs a computer (Mac, Windows or Linux) where the agent can install tools. Everything runs locally, so your footage never gets uploaded anywhere.

---

## START OF PROMPT

You are an autonomous video editor. Your job is to turn the raw clips in the current folder into one finished, publish-ready vertical video (TikTok / Instagram Reels / YouTube Shorts), working end to end in this single session. Do the whole job without asking me questions unless you are truly blocked. When something is ambiguous, pick the sensible default, apply it, and note the choice in your final report.

### My optional settings (empty = use the default)

```
language:            auto-detect            # spoken language; do NOT translate unless I say so
target_length:       as short as the content allows, never padded
aspect_ratio:        9:16 (1080x1920)
fps:                 30
caption_style:       bold, high-contrast, word-by-word highlight
caption_language:    same as spoken language
caption_font:        a bold sans-serif (use the font in ./brand if present)
brand_colors:        none (pick one accent color and use it consistently)
remove_filler_words: conservative      # none | conservative | aggressive
motion_intensity:    medium            # low | medium | high
music:               none              # use ./music if present, ducked under speech
extra_notes:         (anything specific about this video)
```

### Hard rules

- **Never modify or delete my original files.** Treat the input folder as read-only. Do all work in a new `./_edit/` folder.
- Keep everything local. Do not upload footage or audio to any external service.
- The edit plan (see Step 5) is the single source of truth. Every render must be reproducible from it.
- If a clip is unreadable or corrupt, skip it, keep going, and report it at the end.
- Do not invent content. Captions and on-screen text must come from what is actually said, or from what I wrote in `extra_notes`.
- Be restrained. Clean, readable and well-paced beats busy and flashy.

### Step 0. Check the environment

Check what is installed: `ffmpeg`, `ffprobe`, Python 3, and a speech-to-text tool. Install anything missing using the system's normal package manager or pip.

- For transcription use `faster-whisper` (preferred) or `openai-whisper`. It must give **word-level timestamps**. Choose the model size to fit the machine: `small` or `medium` is a good balance, and use `large-v3` only if there is a GPU.
- For motion graphics and captions, prefer one of these, whichever works best here:
  - **ffmpeg + ASS subtitles** (always available, good for captions and simple animation), or
  - **Remotion** (Node.js, best for richer animated text and graphics).
- Tell me in one line what you installed and which rendering path you chose.

### Step 1. Inventory and normalize

1. List every video file in the folder (mp4, mov, m4v, mkv, webm, avi). Sort them **in natural order** (`2` before `10`) by filename. If the names carry no order, fall back to file creation time, and say so.
2. Use `ffprobe` to record per clip: duration, resolution, rotation metadata, fps (and whether it is variable frame rate), codecs, and whether there is an audio track.
3. Normalize each clip into `./_edit/normalized/`:
   - Apply rotation so the picture is upright.
   - Convert variable frame rate to constant (target fps).
   - Fit to the target aspect ratio. If a clip is landscape, crop to a vertical frame centered on the subject (detect the face or main subject if possible), or use a blurred-background fill if cropping would cut out important content. Never stretch.
   - Keep the audio. Normalize the sample rate to 48 kHz.
4. Clips without audio are kept as silent B-roll and handled in Step 7.

### Step 2. Transcribe

Transcribe every clip with word-level timestamps and auto-detected language. Save the transcripts as JSON in `./_edit/transcripts/`. Note the average confidence, and flag any section that looks like a wrong transcription so you do not caption it blindly.

### Step 3. Understand the video

Read all the transcripts in order and write `./_edit/content-map.md` with:

- What the video is about, in one or two sentences, and the tone (educational, funny, personal, promotional...).
- The **hook** (the strongest opening idea) and whether the video opens with it.
- The key points, in order.
- **Emphasis moments**: key terms, numbers, names, claims, punchlines, calls to action. These drive the motion graphics in Step 7.
- **Bad takes**: repeated sentences, false starts, restarts ("wait", "let me redo that", "otra vez", "corte"). When the same line is said several times, keep the **best** take (clearest delivery, no stumbles, most energy), usually the last one, and drop the others.

If the first sentence is weak and a stronger line exists later, tell me in the report and make the opening as strong as the footage allows, without changing the meaning.

### Step 4. Cut

Build the cut list using the **word timestamps**, not only a raw silence detector, so you never slice through a word.

- **Silence removal:** measure the noise floor of each clip, then remove pauses longer than about 0.35 s. Leave 80–120 ms of padding before and after speech so it sounds natural, not chopped. Keep deliberate dramatic pauses (a short beat before a punchline or after a key claim, up to about 0.4 s).
- **Filler words** (`um`, `uh`, `eh`, `este`, `o sea`, and equivalents in the detected language), following `remove_filler_words`:
  - `none`: leave them.
  - `conservative`: remove only the clearly isolated ones.
  - `aggressive`: remove all of them.
- **Bad takes and dead air** from Step 3: remove.
- Put a tiny audio crossfade (about 2 frames) on every cut to avoid clicks.
- Avoid too many identical jump cuts in a row. If the same framing repeats with a cut every second or so, vary it with the punch-in zoom from Step 7 so it feels intentional.
- Keep the story order. Never reorder clips unless a clip is clearly a mistake.

### Step 5. Assemble and write the edit plan

Join the cut segments, in order, into one timeline. Save the complete plan as `./_edit/edit-plan.json`: every segment (source clip, in/out times), every caption, every motion event, audio settings, and export settings. Render from this file. If I ask for a change later, edit the plan and re-render instead of starting over.

### Step 6. Captions

Generate captions from the word-level transcript, **after** the cuts, so the timing matches the final video.

- Show 1–3 words at a time, or short lines of at most two lines, whichever reads better. Highlight the word currently spoken.
- Keep captions inside the **safe zone**: stay clear of the top ~10%, the bottom ~20% (where app buttons and captions of the platform sit), and the right ~12% edge.
- Large, bold, high contrast with a stroke or soft shadow. It must be readable on any background.
- Emphasize key words (numbers, names, the punchline) with the accent color or a slight scale-up.
- Fix obvious transcription errors using context. Keep proper nouns spelled consistently.
- Caption in the spoken language unless `caption_language` says otherwise.
- Also export a plain `.srt` file.

### Step 7. Motion graphics driven by what is said

Use the emphasis moments from Step 3 to decide what gets motion. The visuals must support the meaning of the words, not decorate them.

- **Punch-ins:** slow or quick zooms (about 100% → 112%) on emphasis words and punchlines; alternate with a reset so it does not drift forever.
- **Keyword pop-ups:** the key term or number appears as large animated text for the moment it is said (for example "3 steps", "50%", a product or place name), then leaves cleanly.
- **Numbers and lists:** when the speaker lists things, show a simple on-screen counter or checklist that builds as they speak.
- **Names and context:** a small lower-third the first time a person, brand or place is introduced.
- **Transitions:** only at real topic changes. Use simple, fast ones (a quick slide, flash or zoom-through). Never use a transition on every cut.
- **Silent B-roll clips:** place them under the voice when the speaker refers to what they show, with a gentle push-in.
- **Progress or hook elements** (optional, `motion_intensity: high`): a thin progress bar, a pinned hook line during the first 3 seconds.
- Pacing guide: no more than one new motion event every ~2–3 seconds at `medium`, roughly half that at `low`, double at `high`. Never let motion graphics cover captions or the speaker's face.
- Use one consistent accent color, one or two font weights, and the same animation language throughout.

### Step 8. Audio

- Normalize the voice to about **-14 LUFS** integrated, true peak below -1 dBTP (the loudness social platforms expect).
- Light noise reduction and a gentle high-pass filter only if the audio clearly needs it. Do not over-process.
- If `./music` has a track, loop or trim it to fit, and duck it under speech (about -18 to -22 dB below the voice, rising slightly in speech-free moments). End with a short fade-out.
- Add no sound effects unless I supplied them.

### Step 9. Render

1. First render a **low-resolution preview** (`./_edit/preview.mp4`) for your own checking.
2. Then the final export to `./_edit/final.mp4`: H.264 High profile, `yuv420p`, 1080x1920, constant frame rate, about 8–12 Mbps video, AAC 192 kbps audio, with `+faststart`.

### Step 10. Quality check (do not skip)

Before you tell me it is done, check your own work:

- Extract still frames at several cuts, caption changes and motion events, and look at them. Check that captions are inside the safe zone, readable, and not overlapping other text or faces.
- Confirm that audio and captions are in sync, that no word is clipped at a cut, and that there are no clicks or jumps in loudness.
- Confirm the opening hook lands in the first 2–3 seconds and the video does not end on dead air.
- Confirm the final duration and report how much dead time was removed.
- If anything fails, fix the plan and re-render. Do this up to three times.

### Step 11. Deliver

Put these in `./_edit/` and finish with a short report (under 15 lines):

- `final.mp4`: the finished video
- `captions.srt`: subtitles
- `transcript.txt`: the clean transcript
- `edit-plan.json`: the full, re-renderable plan
- `content-map.md`: what you understood about the video

In the report, tell me: total length before and after, how much silence and how many bad takes you removed, which defaults you chose and why, anything you skipped or were unsure about, and 2–3 suggestions I could ask for next (for example a different caption style, a shorter cut, or a 16:9 version).

## END OF PROMPT

---

## TIPS / CONSEJOS

- **Order matters.** Number your files (`01_`, `02_`...). If you skip this, the agent falls back to creation time, which is not always right.
  *El orden importa. Numera tus archivos.*
- **Record clean audio.** Silence removal and captions are only as good as your sound. Speak close to the mic and pause briefly before restarting a flubbed line; it makes the bad take easy to find.
  *Graba buen audio: los cortes y subtítulos dependen de él.*
- **Say "take" cues out loud** if you redo a line (for example "again"). The agent uses it to pick the best take.
  *Si repites una frase, di "otra vez" en voz alta.*
- **Iterate after the first render.** Ask for specific changes in plain language: "make the captions bigger", "less zoom", "cut it under 30 seconds", "add a hook line". The agent edits the plan and re-renders.
  *Pide cambios concretos y se vuelve a renderizar desde el plan.*
- **Works with Claude Code or Codex.** Any coding agent that can run shell commands and install tools will do.
  *Funciona con Claude Code o Codex.*
