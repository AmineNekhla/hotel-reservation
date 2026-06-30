package com.hotelreservation.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response body returned by the API on any failure.
 * <p>
 * All error responses follow this consistent shape so API consumers
 * can reliably parse failures without branching on status codes alone.
 * </p>
 *
 * <pre>
 * {
 *   "timestamp": "2025-06-30T14:00:00",
 *   "status": 404,
 *   "error": "Not Found",
 *   "message": "Room not found with id: 99",
 *   "path": "/api/rooms/99",
 *   "fieldErrors": null
 * }
 * </pre>
 */
public class ApiErrorResponse {

    /** UTC timestamp of when the error occurred. */
    private final LocalDateTime timestamp;

    /** HTTP status code (e.g., 400, 404, 500). */
    private final int status;

    /** Short human-readable status label (e.g., "Not Found"). */
    private final String error;

    /** Detailed error description safe to display to end users. */
    private final String message;

    /** The request URI that triggered the error. */
    private final String path;

    /**
     * Field-level validation errors, populated only for 400 Validation Failed responses.
     * Key = field name, Value = constraint violation message.
     * {@code null} for all other error types.
     */
    private final Map<String, String> fieldErrors;

    public ApiErrorResponse(int status, String error, String message,
                            String path, Map<String, String> fieldErrors) {
        this.timestamp   = LocalDateTime.now();
        this.status      = status;
        this.error       = error;
        this.message     = message;
        this.path        = path;
        this.fieldErrors = fieldErrors;
    }

    public LocalDateTime getTimestamp()         { return timestamp; }
    public int getStatus()                      { return status; }
    public String getError()                    { return error; }
    public String getMessage()                  { return message; }
    public String getPath()                     { return path; }
    public Map<String, String> getFieldErrors() { return fieldErrors; }
}
