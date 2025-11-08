# AI Routine Generation Feature

## Overview

This feature allows users to select skincare products and generate a personalized skincare routine using OpenAI's GPT-4o model. The routine is displayed in an interactive chat window.

## Key Features

### 1. **Product Selection**

- Users select products by clicking product cards
- Selected products are tracked in a JavaScript `Set`
- Visual feedback with red border and green checkmark
- Product tags appear in the "Selected Products" section

### 2. **Generate Routine Button**

- Located in the "Selected Products" section
- Red-to-Gold gradient styling
- Disabled when no products selected (shows error message)
- Triggers AI routine generation

### 3. **AI Integration**

- **Model**: GPT-4o (OpenAI)
- **Server-side**: Requires `/api/openai` endpoint
- **Data sent**: Product name, brand, category, description
- **Response**: Structured skincare routine with step-by-step guidance

### 4. **Chat Window Display**

- User prompts shown with gradient background (right-aligned)
- AI responses shown with light background (left-aligned)
- Loading indicator ("Thinking...") during API calls
- Smooth scroll to latest message
- Full conversation history maintained

### 5. **Conversation History**

- System message sets assistant behavior
- User messages and AI responses stored in `messages` array
- Context maintained across multiple messages
- Can ask follow-up questions about the routine

## Code Architecture

### Data Collection

```javascript
/* Collects selected product data from allProducts array */
getSelectedProductData()
  → Returns: Array of full product objects with name, brand, category, description
```

### Routine Generation

```javascript
/* Main function to generate routine */
generateRoutineWithAI()
  → Validates product selection
  → Collects product data
  → Creates OpenAI prompt
  → Sends to server endpoint
  → Displays result in chat
```

### Chat Communication

```javascript
/* Sends chat messages to OpenAI */
sendMessageToOpenAI()
  → Uses messages array with full history
  → Maintains conversation context
  → Handles errors gracefully
```

## API Integration

### Server Endpoint Required

```
POST /api/openai
Content-Type: application/json

Request body:
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful skincare routine assistant..."
    },
    {
      "role": "user",
      "content": "Based on these products..."
    }
  ]
}

Expected response:
{
  "choices": [
    {
      "message": {
        "content": "Here's your personalized routine..."
      }
    }
  ]
}
```

### What the Server Should Do

1. Receive `messages` array from client
2. Forward to OpenAI Chat Completions API
3. Use model: `gpt-4o`
4. Include your OpenAI API key (never exposed to client)
5. Return response as JSON

### Example Node.js/Express Implementation

```javascript
app.post("/api/openai", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## User Flow

### Generate Routine

1. User selects one or more products
2. Products appear as tags in selected section
3. User clicks "Generate Routine" button
4. System shows loading indicator
5. AI receives product data
6. User sees "Generate routine for X product(s)" in chat
7. AI generates personalized routine based on products
8. Routine appears in chat with formatting
9. User can ask follow-up questions

### Chat Follow-up

1. After routine is generated, user can chat normally
2. System maintains context about selected products
3. User can ask for adjustments, tips, or clarifications
4. Each message has full conversation history

## Product Data Sent to AI

For each selected product, the following is sent:

```
- {name} ({brand}, {category}): {full description}

Example:
- Foaming Facial Cleanser (CeraVe, cleanser): Gentle gel cleanser with ceramides, hyaluronic acid, and niacinamide. Deeply cleanses normal to oily skin, removing oil, dirt, and makeup without harming the barrier...
```

## Error Handling

### No Products Selected

- Shows: "Please select at least one product before generating a routine!"

### Product Data Not Found

- Shows: "Unable to load product data. Please try again."

### API Connection Error

- Shows: "Error generating routine. Make sure your server endpoint is configured correctly."

### API Response Error

- Shows: "Unable to generate routine. Please try again."

## System Prompt

The assistant is guided by this system message:

```
"You are a helpful skincare routine assistant. Provide personalized skincare routine recommendations based on selected products. Keep responses clear, friendly, and organized with step-by-step guidance."
```

This ensures:

- Responses focus on skincare routines
- Clear, step-by-step format
- Friendly, approachable tone
- Personalized to selected products

## Beginner-Friendly Code

### Comments Explain

- What each function does
- Why we use Sets for product tracking
- How data flows to the API
- How responses are handled

### Simple Structure

- Async/await for readable API calls
- Error handling with try/catch
- Clear variable names
- Logical function organization

## Security Notes

⚠️ **IMPORTANT**: Never expose OpenAI API key in client code!

- Server endpoint handles authentication
- Client only sends messages
- Key is stored server-side in environment variable

## Future Enhancements

- Save generated routines to user account
- Export routine as PDF or image
- Share routine via social media
- Rate routine quality
- Get routine variations for different skin types
- Add product alternatives suggestions
- Store routine history
- Customize routine time frames (quick, detailed, etc.)
