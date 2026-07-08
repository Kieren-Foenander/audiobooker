# Audiobooker

A single-user, local-only application for converting book chapters into multi-voice audiobooks using on-device analysis and text-to-speech.

## Language

**Book Project**:
The container for one book being converted to audiobook form. Holds characters, voice assignments, and all chapters for that book so character knowledge persists across chapters.
_Avoid_: Project, book workspace

**Chapter**:
One section of source prose submitted for analysis and audio generation. Chapters belong to a Book Project.
_Avoid_: Episode, section

**Character**:
A named persona who speaks dialogue in the book. Characters are discovered during chapter analysis and recalled in later chapters within the same Book Project.
_Avoid_: Speaker, actor, role

**Voice**:
The audio identity assigned to a Character or the narrator. Comprises a reference clip (derived from source material) and optional description of how the character speaks.
_Avoid_: Profile, voice profile (unless referring to the trained model artifact specifically)

**Reference Clip**:
A short (5–15 second) audio excerpt used by the TTS engine to clone a Voice. Derived from trimmed source material — not a trained model.
_Avoid_: Training data, sample, WAV upload

**Voice Source**:
The origin material used to create a Reference Clip — typically a YouTube video URL plus the user-selected trim range.
_Avoid_: Reference file, audio upload

**Reference Clip Trim**:
The user-selected start and end points within a Voice Source, identifying a stretch of clear solo speech suitable for voice cloning.
_Avoid_: Crop, cut, sample selection

**Segment**:
A contiguous block of text assigned to one Character (or the narrator) for a single stretch of audio. Segments are ordered to form the chapter timeline.
_Avoid_: Clip, line, utterance

**Confidence Score**:
The analysis model's certainty that a given Segment is correctly attributed to its assigned Character. Low-confidence segments are flagged for user review before audio generation.
_Avoid_: Probability, accuracy

**Timeline**:
The ordered sequence of generated audio Segments that forms the playable chapter, including gaps and pacing between clips. Played virtually in-app; exported to a single file on demand.
_Avoid_: Track, playlist

**Export**:
A rendered audio file combining all Segment audio for a Chapter with uniform gaps between them. Generated on demand, not kept in sync automatically.
_Avoid_: Render, download, master file

**Job**:
A unit of background work — such as chapter analysis or audio generation — queued by the app and executed by the Python worker. Jobs have a status the UI polls until complete.
_Avoid_: Task, process, run

**Narrator**:
The voice that reads non-dialogue prose. May differ per Chapter (e.g. POV shifts). Not the same as a Character who only speaks dialogue.
_Avoid_: POV, omniscient voice

**Narrator Assignment**:
The Voice assigned to read narration for a specific Chapter. Defaults to the previous Chapter's assignment but can be overridden when POV shifts.
_Avoid_: POV setting, narration voice

**Source Text**:
The raw prose of a Chapter as pasted or imported by the user. Changing Source Text after analysis marks the Chapter stale.
_Avoid_: Manuscript, input

**Voice Assignment**:
The link between a Character (or Narrator) and a Voice within a Book Project. Inherited by all Chapters unless overridden.
_Avoid_: Casting, mapping

**Analysis**:
The single-pass LLM process that reads a Chapter's Source Text and produces Characters, Segments, and Confidence Scores. Runs as a background Job via the Python worker.
_Avoid_: Parsing, breakdown, processing
