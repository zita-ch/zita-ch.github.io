---
layout: archive
title: "Student Projects"
permalink: /student-projects/
author_profile: true
---

{% include base_path %}

Here are the student projects I have significantly supervised.

{% assign portfolio_projects = site.portfolio | sort: "sort_order" %}
{% for post in portfolio_projects %}
  {% include archive-single.html %}
{% endfor %}
