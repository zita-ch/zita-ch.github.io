---
layout: archive
title: "Student Projects"
permalink: /student-projects/
author_profile: true
---

{% include base_path %}

Here are the student projects I have significantly supervised.

{% for post in site.portfolio %}
  {% include archive-single.html %}
{% endfor %}
