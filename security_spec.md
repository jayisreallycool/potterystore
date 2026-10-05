# Security Specification for Kiln & Clay Atelier

## 1. Data Invariants
- Default Deny: All paths are locked down by default unless specifically permitted.
- Products: Publicly readable so customers can browse the catalog; only verified administrators can create, update, or delete products.
- Orders: Any customer (authenticated or guest with valid structure) can create an order. Customers can only read and list their own orders. Only verified administrators can view all orders and update fulfillment statuses.
- Admins: Defined either by trusted email `buddhacmd02@gmail.com` with `email_verified == true` or existence of `/admins/{uid}` document.
- Inquiries: Anyone can submit a consultation message with bounded fields; only administrators can read, list, update, or delete inquiries.
- User Profiles: Users can only write and read their own user profile `/users/{userId}`. Role modification by normal users is prohibited.

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. Unauthenticated write to `/products/p1` with admin pretending payload -> REJECT
2. Normal user attempt to update product price -> REJECT
3. Customer attempting to list all orders from `/orders` without matching `userId` -> REJECT
4. Order creation with missing required fields (`customerEmail`, `total`) -> REJECT
5. Order creation attempting to inject arbitrary 2MB payload or malicious keys -> REJECT
6. Non-admin attempting to change order status to `delivered` -> REJECT
7. Unauthenticated user trying to read inquiries -> REJECT
8. Customer attempting to elevate their own role to `admin` in `/users/{userId}` -> REJECT
9. Non-admin attempting to write to `/admins/{uid}` -> REJECT
10. Anonymous/malformed inquiry exceeding string boundaries -> REJECT
11. Reading another customer's order without admin credentials -> REJECT
12. Attempt to update immutable field `createdAt` on orders or products -> REJECT
