export function validateSessionAsAdmin(event: any) {
    const admin = getCookie(event, "admin_session")

    return (admin === "enabled")
}