import { readJSON, writeJSON } from './storage'

// SCRUM-111: there is no backend for terraform yet, so configs are saved to
// localStorage. When the Django endpoint exists, replace the bodies of
// loadTerraform/saveTerraform with fetch calls; the editor only depends on
// these two functions and their return shapes.

const STORAGE_KEY = 'cyberrange.terraform.main'

export const DEFAULT_TERRAFORM = `terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Isolated network for the practice range
resource "docker_network" "range" {
  name     = "cyber-range"
  internal = true
}

# Target machine the user defends
resource "docker_container" "target" {
  name  = "range-target"
  image = "vulnerables/web-dvwa"

  networks_advanced {
    name = docker_network.range.name
  }
}

# AI attacker box
resource "docker_container" "attacker" {
  name  = "range-attacker"
  image = "kalilinux/kali-rolling"
  command = ["sleep", "infinity"]

  networks_advanced {
    name = docker_network.range.name
  }
}
`

export function loadTerraform() {
  const saved = readJSON(STORAGE_KEY, null)
  if (saved && typeof saved.content === 'string') {
    return { content: saved.content, savedAt: saved.savedAt ?? null }
  }
  return { content: DEFAULT_TERRAFORM, savedAt: null }
}

export async function saveTerraform(content) {
  // Simulated network delay so the "Saving…" state is visible and the UI is
  // already async-ready for the real API.
  await new Promise((resolve) => setTimeout(resolve, 350))

  const savedAt = new Date().toISOString()
  if (!writeJSON(STORAGE_KEY, { content, savedAt })) {
    throw new Error('Could not save to this browser')
  }
  return { savedAt }
}
