---
description: How to preview the website locally using Jekyll
---

1. Ensure you have the necessary system dependencies installed:
   ```bash
   sudo apt install ruby-dev ruby-bundler nodejs build-essential gcc make
   ```

2. Install the project's Ruby dependencies:
   ```bash
   bundle install
   ```
   *Note: If you encounter errors, try deleting `Gemfile.lock` and running `bundle install` again.*

3. Start the local Jekyll server:
   ```bash
   bundle exec jekyll serve -l -H localhost
   ```

4. Once the server is running, open your browser and navigate to `http://localhost:4000`. The site will automatically rebuild and refresh when you make changes to files.
