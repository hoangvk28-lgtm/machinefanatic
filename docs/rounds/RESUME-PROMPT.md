# Standing resume prompt (paste into a new session after any interruption)

```
Đọc CLAUDE.md, rồi đọc mục "## RESUME" MỚI NHẤT (mục cuối cùng) trong docs/rounds/NEXT-ROUNDS-BRIEF.md và "Winter plan" nếu có.
KHÔNG push gì cho tới khi tôi duyệt preview.
1. git status + git log -3 để biết trạng thái. Chạy lệnh "Unfinished" trong mục RESUME; báo tôi số slug còn lại mỗi list và các skip mới của writer.
2. Nếu còn slug: giao tối đa 2-3 agent Sonnet (model: "sonnet"), mỗi agent nhận cả list một lần, theo writer prompt và luật thêm ghi trong brief/RESUME. Bỏ list đã xong.
3. Khi xong: Finish đầy đủ cho tất cả slug của round (register, mark done, mark skip, audit, grep 【, 2 bước kiểm tra trùng lặp với mở câu lặp nhiều nhất <= 6, sửa bằng Edit + finish.mjs nếu vượt, tsc, build, clone-log, commit local).
4. Đưa tôi link preview (tôi tự chạy npx next dev -p 3005). Chờ duyệt, rồi push main và IndexNow các slug mới.
5. Nếu round đã push xong: làm Stage A + A2 cho round kế tiếp theo kế hoạch trong brief, giao writer, và trước khi kết thúc phiên luôn ghi một mục RESUME mới + commit local.
```

Coordinator rule: every time a round changes state (writers spawned, finished, pushed), append a new dated `## RESUME` section with the "Unfinished" command for the current lists, so this prompt always works.
