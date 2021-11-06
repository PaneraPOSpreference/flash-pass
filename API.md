# API Documentation

All endpoints go through `https://breadpass.vercel.app/api/` where the endpoint follows this string

All responses will have `{ ok: boolean, message: string, data: any }`, where `data` is specified in `Response` in the table

| Endpoint  |  Method  | Request     | Response |
|--------------|---------|----------|------------|
| /user | POST | { userId: string }  | { id: string, name: string, ...all other user data }  |
| /user  | PUT | { userId: string, name: string, ...other info}  | { id: string, ...user data} |