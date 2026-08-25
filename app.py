from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# ==========================
# HOME PAGE
# ==========================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================
# CHALLENGE DATA
# ==========================

challenges = {
    "energy-saver": {
        "icon": "💡",
        "title": "Energy Saver",
        "subtitle": "Reduce electricity waste for 7 days.",
        "goal": "Reduce unnecessary electricity use in your household.",
        "actions": [
            "Turn off lights when leaving a room.",
            "Unplug devices that are not being used.",
            "Avoid leaving electronics on standby.",
            "Use natural light when possible."
        ]
    },

    "water-warrior": {
        "icon": "💧",
        "title": "Water Warrior",
        "subtitle": "Complete daily actions to protect every drop.",
        "goal": "Reduce unnecessary water use for 7 days.",
        "actions": [
            "Turn off the tap while brushing your teeth.",
            "Take shorter showers.",
            "Fix or report leaking taps.",
            "Avoid wasting water while washing."
        ]
    },

    "food-hero": {
        "icon": "🍽️",
        "title": "Food Hero",
        "subtitle": "Take the challenge to reduce wasted food.",
        "goal": "Reduce the amount of food your household throws away.",
        "actions": [
            "Only take the amount of food you need.",
            "Store leftovers properly.",
            "Check what food you already have before shopping.",
            "Try to use food before it expires."
        ]
    },

    "plastic-patrol": {
        "icon": "♻️",
        "title": "Plastic Patrol",
        "subtitle": "Join the mission to reduce single-use plastics.",
        "goal": "Reduce your household's single-use plastic waste.",
        "actions": [
            "Carry a reusable water bottle.",
            "Avoid unnecessary plastic bags.",
            "Choose reusable containers.",
            "Say no to unnecessary single-use plastic."
        ]
    },

    "energy-guardian": {
        "icon": "🔥",
        "title": "Energy Guardian",
        "subtitle": "Build smarter cooking habits and save fuel.",
        "goal": "Use cooking fuel more efficiently.",
        "actions": [
            "Use the correct flame size for your cookware.",
            "Cover pots when cooking.",
            "Avoid leaving the flame on unnecessarily.",
            "Check that your cooking equipment is working efficiently."
        ]
    },

    "green-journey": {
        "icon": "🚗",
        "title": "Green Journey",
        "subtitle": "Choose cleaner ways to travel.",
        "goal": "Reduce unnecessary vehicle use for 7 days.",
        "actions": [
            "Walk when your destination is nearby.",
            "Use public transport when practical.",
            "Share rides when possible.",
            "Combine multiple errands into one trip."
        ]
    },

    "sky-impact": {
        "icon": "✈️",
        "title": "Sky Impact",
        "subtitle": "Make travel choices that protect our atmosphere.",
        "goal": "Think about the environmental impact of air travel.",
        "actions": [
            "Consider whether a trip can be avoided.",
            "Choose alternatives to flying when practical.",
            "Combine trips when possible.",
            "Plan future travel thoughtfully."
        ]
    }
}


# ==========================
# CHALLENGE PAGE
# ==========================

@app.route("/challenge/<challenge_id>")
def challenge(challenge_id):

    challenge_data = challenges.get(challenge_id)

    if challenge_data is None:
        return "Challenge not found", 404

    return render_template(
        "challenge.html",
        challenge=challenge_data
    )

# ==========================
# CALCULATOR
# ==========================

@app.route("/calculate", methods=["POST"])
def calculate():

    # ==========================
    # User Inputs
    # ==========================

    electricity = float(request.form["electricity"])
    water = float(request.form["water"])
    food = float(request.form["food"])
    plastic = float(request.form["plastic"])
    transport = float(request.form["transport"])
    size = int(request.form["size"])
    gas = float(request.form["usage"])
    flights = int(request.form["flights"])

    # ==========================
    # Emission Factors
    # ==========================

    ELECTRICITY_FACTOR = 0.45
    WATER_FACTOR = 0.00034
    FOOD_FACTOR = 2.5
    PLASTIC_FACTOR = 6.0
    TRANSPORT_FACTOR = 0.171

    LPG_FACTOR = 3.0
    LPG_CYLINDER_WEIGHT = 14

    FLIGHT_FACTOR = 250

    # ==========================
    # Annual Inputs
    # ==========================

    electricity_year = electricity * 12
    water_year = water * 12
    food_year = food * 12
    plastic_year = plastic * 12
    transport_year = transport * 12

    gas_year = gas * 12
    gas_kg_year = gas_year * LPG_CYLINDER_WEIGHT

    # ==========================
    # Annual CO₂e
    # ==========================

    electricity_score = electricity_year * ELECTRICITY_FACTOR
    water_score = water_year * WATER_FACTOR
    food_score = food_year * FOOD_FACTOR
    plastic_score = plastic_year * PLASTIC_FACTOR
    transport_score = transport_year * TRANSPORT_FACTOR

    gas_score = gas_kg_year * LPG_FACTOR

    flight_score = flights * FLIGHT_FACTOR

    # ==========================
    # Total Footprint
    # ==========================

    household_footprint = (
        electricity_score +
        water_score +
        food_score +
        plastic_score +
        transport_score +
        gas_score +
        flight_score
    )

    per_person_footprint = household_footprint / size

    # ==========================
    # Global Comparison
    # ==========================

    GLOBAL_AVERAGE = 5000

    global_percentage = (
        per_person_footprint / GLOBAL_AVERAGE
    ) * 100

    if global_percentage < 100:

        difference = round(100 - global_percentage, 1)

        comparison_message = (
            f"You are {difference}% below the global average 🌱"
        )

    elif global_percentage == 100:

        comparison_message = (
            "You are exactly at the global average 🌍"
        )

    else:

        difference = round(global_percentage - 100, 1)

        comparison_message = (
            f"You are {difference}% above the global average ⚠️"
        )

    # ==========================
    # Categories
    # ==========================

    categories = {
        "Electricity": electricity_score,
        "Water": water_score,
        "Food Waste": food_score,
        "Plastic": plastic_score,
        "Transport": transport_score,
        "Gas": gas_score,
        "Flights": flight_score
    }

    largest = max(categories, key=categories.get)

    # ==================================================
    # FAMILY-SIZE BENCHMARKS
    # ==================================================
    #
    # These are prototype benchmark values.
    #
    # Monthly:
    # Electricity -> kWh/person/month
    # Water       -> L/person/month
    # Food waste  -> kg/person/month
    # Plastic     -> kg/person/month
    # Transport   -> km/person/month
    # Gas         -> cylinders/person/month
    #
    # Flights -> flights/person/year
    #
    # We can replace these later with properly
    # sourced values.
    # ==================================================

    BENCHMARKS = {

        "Electricity": 200,

        "Water": 2000,

        "Food Waste": 2,

        "Plastic": 1.5,

        "Transport": 300,

        "Gas": 0.25,

        "Flights": 1

    }

    # ==========================
    # Calculate Household
    # Benchmarks
    # ==========================

    electricity_limit = BENCHMARKS["Electricity"] * size
    water_limit = BENCHMARKS["Water"] * size
    food_limit = BENCHMARKS["Food Waste"] * size
    plastic_limit = BENCHMARKS["Plastic"] * size
    transport_limit = BENCHMARKS["Transport"] * size
    gas_limit = BENCHMARKS["Gas"] * size
    flights_limit = BENCHMARKS["Flights"] * size

    # ==========================
    # Generate Recommendations
    # ==========================

    recommendations = []

    # 120% threshold
    threshold = 1.20

    # Electricity
    if electricity > electricity_limit * threshold:

        recommendations.append(
            "💡 <strong>Electricity:</strong> "
            f"Your household uses {electricity:.0f} kWh/month, "
            f"which is above the benchmark of "
            f"{electricity_limit:.0f} kWh/month for a family of {size}. "
            "Try switching off unused lights and appliances, "
            "using natural light, and avoiding standby power."
        )

    # Water
    if water > water_limit * threshold:

        recommendations.append(
            "💧 <strong>Water:</strong> "
            f"Your household uses {water:.0f} L/month, "
            f"compared with a benchmark of "
            f"{water_limit:.0f} L/month. "
            "Try taking shorter showers, turning off taps when "
            "not needed, and checking for leaks."
        )

    # Food
    if food > food_limit * threshold:

        recommendations.append(
            "🍽️ <strong>Food waste:</strong> "
            f"Your household wastes about {food:.1f} kg/month, "
            f"above the benchmark of {food_limit:.1f} kg/month. "
            "Plan meals before shopping, store leftovers properly, "
            "and check your fridge before buying more food."
        )

    # Plastic
    if plastic > plastic_limit * threshold:

        recommendations.append(
            "♻️ <strong>Plastic:</strong> "
            f"Your household produces about {plastic:.1f} kg/month, "
            f"above the benchmark of {plastic_limit:.1f} kg/month. "
            "Try reusable bottles and containers and reduce "
            "single-use plastic."
        )

    # Transport
    if transport > transport_limit * threshold:

        recommendations.append(
            "🚗 <strong>Transport:</strong> "
            f"Your household travels about {transport:.0f} km/month, "
            f"above the benchmark of {transport_limit:.0f} km/month. "
            "Consider walking, cycling, public transport, "
            "carpooling, or combining errands."
        )

    # Gas
    if gas > gas_limit * threshold:

        recommendations.append(
            "🔥 <strong>Cooking fuel:</strong> "
            f"Your household uses about {gas:.2f} LPG cylinders/month, "
            f"above the benchmark of {gas_limit:.2f} cylinders/month. "
            "Use the correct flame size, cover pots while cooking, "
            "and avoid leaving the flame on unnecessarily."
        )

    # Flights
    if flights > flights_limit * threshold:

        recommendations.append(
            "✈️ <strong>Air travel:</strong> "
            f"Your household takes about {flights} flights/year, "
            f"above the benchmark of {flights_limit} flight(s)/year. "
            "When practical, consider alternatives to flying "
            "and combine trips."
        )

    # ==========================
    # If Everything Is Good
    # ==========================

    if len(recommendations) == 0:

        recommendation = (
            "🌱 <p>Great job!</p> "
            f"Your household of {size} is within the prototype "
            "benchmarks across all categories. "
            "Keep up the sustainable habits!"
        )

    else:

        recommendation = (
            "<strong>🌍 Polaris Recommendations</strong><br><br>"
            + "<br><br>".join(recommendations)
        )

    # ==========================
    # Graph Data
    # ==========================

    graph_data = {

        "Electricity": round(electricity_score, 2),

        "Water": round(water_score, 2),

        "Food Waste": round(food_score, 2),

        "Plastic": round(plastic_score, 2),

        "Transport": round(transport_score, 2),

        "Gas": round(gas_score, 2),

        "Flights": round(flight_score, 2)

    }

    # ==========================
    # Return JSON
    # ==========================

    return jsonify({

        "household": round(household_footprint, 2),

        "per_person": round(per_person_footprint, 2),

        "global_average": GLOBAL_AVERAGE,

        "global_percentage": round(global_percentage, 1),

        "comparison_message": comparison_message,

        "largest": largest,

        # ⭐ THIS FIXES YOUR undefined ERROR
        "recommendation": recommendation,

        "electricity": graph_data["Electricity"],

        "water": graph_data["Water"],

        "food": graph_data["Food Waste"],

        "plastic": graph_data["Plastic"],

        "transport": graph_data["Transport"],

        "gas": graph_data["Gas"],

        "flights": graph_data["Flights"]

    })

if __name__ == "__main__":
    app.run(debug=True)