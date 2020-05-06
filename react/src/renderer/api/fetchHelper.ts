// https://www.carlrippon.com/fetch-with-async-await-and-typescript/
interface HttpResponse<T> extends Response {
    parsedBody?: T;
}
export async function http<T>(
    request: RequestInfo
): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(
        request
    );

    try {
        response.parsedBody = await response.json();
    } catch (ex) { }

    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
}
