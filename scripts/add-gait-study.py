import json
from pathlib import Path


PLAN = Path(__file__).with_name("media-plan.json")
RIGHT = "https://cdn.aiwaves.tech/prod/telegram/avatar/2131057/1789964684387672.png"
STAND = "https://cdn.aiwaves.tech/prod/telegram/avatar/2131057/1789964819724804.png"
BASE = (
    "One single complete Ava Morgan detailed pixel RPG sprite. Preserve the copper blazer, "
    "dark indigo trousers, brown loafers, chestnut bob, compact approximately three-head-tall "
    "body, pixel density, outline and steep overhead orthographic camera. She faces NORTH away "
    "from the viewer; show only the back of head and clothes, never face, blouse front or lapels. "
    "One figure centered on solid pale cream, full hair and shoes visible, no shadow, text, prop or extra pose. "
)

experiments = [
    ("opposite_reference", RIGHT,
     "Edit the accepted right-support contact pose into its exact opposite. LEFT shoe plants clearly toward the TOP of the image; RIGHT shoe trails clearly toward the BOTTOM. Preserve the torso and camera. Separate the two shoe silhouettes so neither overlaps the other."),
    ("opposite_reference_exaggerated", RIGHT,
     "Reverse the accepted contact pose. Move the LEFT shoe visibly toward the TOP and the RIGHT shoe visibly toward the BOTTOM, with vertical shoe-center separation about one shoe length. Keep hips level and upright. The result must read as walking even at thumbnail size."),
    ("stand_reference_coordinates", STAND,
     "Change the idle into a left-support walking contact frame. LEFT shoe center must be above the RIGHT shoe center by at least one shoe height. RIGHT heel lifts slightly. Keep both legs individually readable and do not hide either shoe beneath the coat."),
    ("stand_reference_silhouette", STAND,
     "Create a clear left-support stride whose lower-body silhouette differs unmistakably from this idle. LEFT leg extends toward screen top; RIGHT leg extends toward screen bottom. Leave a narrow cream-background gap between the legs and show two complete shoes."),
    ("opposite_reference_arm_lock", RIGHT,
     "Produce the anatomically opposite gait keyframe: left leg forward toward screen top and right leg trailing toward screen bottom; right arm swings toward top and left arm toward bottom. Keep head, shoulders and jacket fixed to the reference."),
    ("stand_reference_contact_phase", STAND,
     "Draw the CONTACT phase of a northbound walk cycle, not a passing pose and not idle. The LEFT heel has just contacted ahead toward screen top; RIGHT toe is the rear contact toward screen bottom. Both feet touch the floor at different vertical positions."),
    ("opposite_reference_footprint", RIGHT,
     "Mirror only the gait phase through time, not the entire image: retain identity and rear view, but exchange which limb leads. LEFT footprint is ahead toward screen top; RIGHT footprint is behind toward screen bottom. Make the two brown loafers distinct and separated."),
    ("stand_reference_motion_read", STAND,
     "Make one restrained but highly readable left-foot-forward walk keyframe for a mobile game. At 80-pixel display height the viewer must still see which foot leads: left shoe up, right shoe down, opposite arm swing. Do not alter body scale."),
    ("opposite_reference_knee", RIGHT,
     "Convert to the opposite support phase. LEFT leg is straight and planted ahead toward screen top. RIGHT knee bends slightly and the right shoe trails toward screen bottom. Keep the pelvis centered with no sideways lean and no crossed legs."),
    ("stand_reference_negative", STAND,
     "Generate a north-facing left-support walking keyframe. Reject an idle stance: feet may not share one baseline, shoes may not overlap, legs may not be parallel and symmetric. LEFT shoe must lead toward top, RIGHT shoe must trail toward bottom, with a natural opposite arm swing."),
]

original = PLAN.read_text()
plans = json.loads(original)
existing = {item["id"] for item in plans}
added = []
for index, (method, reference, instruction) in enumerate(experiments, 1):
    item_id = f"gait-study-up-left-{index:02d}"
    if item_id in existing:
        continue
    added.append({
        "id": item_id,
        "mode": "edit",
        "referenceUrls": [reference],
        "size": {"width": 512, "height": 512},
        "studyMethod": method,
        "prompt": BASE + instruction,
    })

if added:
    closing = original.rfind("]")
    prefix = original[:closing].rstrip()
    comma = "," if prefix.rstrip().endswith("}") else ""
    rendered = json.dumps(added, ensure_ascii=False, indent=2)[1:-1].strip()
    PLAN.write_text(prefix + comma + "\n  " + rendered.replace("\n", "\n  ") + "\n]\n")
