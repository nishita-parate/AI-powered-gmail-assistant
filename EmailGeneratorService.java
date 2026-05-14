package com.email.write;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;
    private final String apiKey;
    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}")String geminiApiKey ) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
    }



    public String generateEmailReply(EmailRequest emailRequest) {

        //build prompt
        String prompt= buildPrompt(emailRequest);
      //prepare raw JSON body
        String requestBody= String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }
                """, prompt);
        //send request
        String response= webClient.post()
                .uri(uriBuilder -> uriBuilder.
                        path("/v1beta/models/gemini-2.5-flash:generateContent")
                        .build())
                .header("x-goog-api-key",apiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract response
                return extractResponseContent(response);

    }

    private String extractResponseContent(String response) {
        ObjectMapper mapper= new ObjectMapper();
        JsonNode root= mapper.readTree(response);
         return root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt= new StringBuilder();
        prompt.append("You are an expert email assistant. Read the following email carefully and write a professional, polite, and concise reply. The reply should directly address the points in the original email.Do not include a subject line. Only return the email body,nothing else.\n\n ");
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a").append(emailRequest.getTone()).append(" tone");
            // Use a professional tone
        }
        prompt.append("Original email \n").append(emailRequest.getEmailContent()).append("\n\nReply");
        return prompt.toString();
    }
}
